import webpack from "webpack";
import request from "request";
import fs from "fs";
import path from "path";
import moment from "moment";
import promptly from "promptly";
import chalk from "chalk";

import UglifyJSPlugin from "uglifyjs-webpack-plugin";
import ZipWebpackPlugin from "zip-webpack-plugin";

import webpackConf from "../webpack.config.js";
import { name as packageName } from "../../package.json";
import { uploadDir, staticPublicPath, serverEnv, api, versionType } from "../config.json";
import deploy from "./deploy";




let publicPath = webpackConf.output && webpackConf.output.publicPath;

const UglifyPlugin = new UglifyJSPlugin({
    compress: {
        warnings: false,
        screw_ie8: false,
        drop_console: true
    },
    output: {
        // for IE8, keep keyword default -> "default"
        keep_quoted_props: true,
        quote_style: 3,
        comments: false
    },
    sourceMap: false
})

const ZipPlugin = new ZipWebpackPlugin({
    path: path.resolve(process.cwd(),uploadDir),
    filename: packageName
})

function startCompire(){
    return new Promise(( resolve, reject ) => {
        webpack(webpackConf, function(err, stats) {
            if (err) {
                throw err;
            }
            // process.stdout.clearLine()
            // process.stdout.cursorTo(0)
            console.log(stats.toString({
                colors: true,
                hash: false,
                version: false,
                timings: false,
                assets: false,
                chunks: false,
                children: false
            }))
            if (stats.hasErrors() || stats.hasWarnings()) {
                reject();
                return;
            }
            resolve();
            return;
        });
    });
}


function chooseEnv(){
    return new Promise(( resolve, reject) => {
        promptly.choose(
            chalk.cyan(`请选择发布 ${chalk.green.bold('test/beta/prod')} 环境:`),
            ["test","beta","prod"],
            (err,value) => {
                if(err)reject(err);
                webpackConf.watch = false;
                if(webpackConf.output){
                    webpackConf.output.publicPath = staticPublicPath[value] || webpackConf.output.publicPath;
                }
                console.log(chalk.cyan(`\n-  publicPath: ${webpackConf.output.publicPath} \n`));
                webpackConf.plugins = webpackConf.plugins.concat([ UglifyPlugin, ZipPlugin ]);
                resolve(value);
            }
        );
    });
}

function getVersionInfo(env){
    const url = `${serverEnv[env]["serverUrl"]}${api["versionSuffix"]}`;
    return new Promise(( resolve, reject ) => {
        request.post({
            url: url,
            form: {
                folderName: packageName
            },
            json: true
        },(err,httpResponse,body) => {
            if (err || !body || body.status != 1) {
                console.log(chalk.red('-------------  获取版本信息错误!!!  -----------'))
                reject(err || body)
            } else {
                resolve(body.data)
            }
        });
    });
}

function uploadFile(env,version){
    const url = `${serverEnv[env]["serverUrl"]}${api["resourceSuffix"]}`;
    const filePath = `${path.resolve(process.cwd(),uploadDir,packageName + ".zip")}`
    const options = {
        url, 
        formData: {
            project: serverEnv[env]["projectId"],
            versionType: versionType,
            version: version,
            isCoverVer: 1,
            file: fs.createReadStream(filePath)
        }, 
        json: true
    }
    return new Promise(( resolve, reject ) => {
        promptly.confirm(
            chalk.cyan(`是否立即发布${env}环境: y/n? `)
        ).then((value) => {
            if(value){
                console.log(chalk.blue('\n----- 上传中,请一定要耐心，毕竟zip包很大...\n'));
                request.post(options, (err, httpResponse, body) => {
                    if (err) {
                        console.log(chalk.red('---- 上传失败,请查实查询dist目录是不是未成功生成zip包。任务被迫终止 ----'));
                        reject(err)
                    } else {
                        console.log(chalk.cyan(`-  已上传至${chalk.cyan.bold(env)}环境\n`));
                        resolve()
                    }
                });
            }else{
                console.log(chalk.red('\n----- 你居然取消了发布 >_<   \n'));
                process.exit(0);
            }
        }).catch(()=>{
            reject();
        });
    });
}

function setAutoUpdate(env){
    const url = `${serverEnv[env]["serverUrl"]}${api["openAutoSuffix"]}`;
    const options = {
        url,
        formData:{
            id: serverEnv[env]["projectId"]
        },
        json: true
    }
    return new Promise(( resolve, reject ) => {
        promptly.confirm(
            chalk.cyan(`是否开启资源: y/n? `)
        ).then((value) => {
            if(value){
                console.log(chalk.blue('\n----- 正在请求开启资源中...\n'));
                request.post(options, (err, httpResponse, body) => {
                    if (err) {
                        console.log(chalk.red('---- 开启失败 ----'));
                        reject(err)
                    } else {
                        console.log(chalk.cyan(`-  开启成功^_^---${env}环境已开启`));
                        resolve()
                    }
                });
            }else{
                console.log(chalk.orange('\n----- 你居然没有开启资源 =。=   \n'));
                resolve()
            }
        }).catch(()=>{
            reject();
        });
    })
}

function validator(value){
    if(!/[\d\.]/g.test(value)){
        throw new Error('输入版本号格式错误。正确格式(例子): 0.11.1');
    }
    return value;
}

function ensureVersion(oldVersion){
    return new Promise(( resolve, reject ) => {
        /*自动添加版本号*/
        if(versionType == 0){
            console.log(chalk.cyan("-  当前使用的是【自动添加版本号】方式\n"));
            resolve("");
        }else if(versionType == 1){/*前端手动管理版本号*/
            console.log(chalk.cyan("-  当前使用的是【前端手动管理版本号】方式\n"));
            promptly.prompt(`-  旧版本号为：${oldVersion}，请输入新版本号:`,{ validator: validator, retry: true })
            .then((value) => {
                resolve(value);
            });
        }else if(versionType == 2){/*后端根据manifest文件来添加版本号*/
            console.log(chalk.cyan("-  当前使用的是【后端根据manifest文件来添加版本号】方式\n"));
            resolve("");
        }else{
            reject();
        }
    });
}

function getDeployVersion(){
    return new Promise(( resolve, reject ) => {
        promptly.prompt(`请输入版本号:`,{ validator: validator, retry: true })
        .then((value) => {
            resolve(value);
        });
    });
}

async function upload(){
    console.log(chalk.cyan('\n-------------  准备发布  -----------\n'));
    //选择发布环境
    const ENV = await chooseEnv();
    //webpack编译
    await startCompire();
    console.log(chalk.cyan('-------------  webpack打包完成  -----------\n'));
    
    //test/beta环境  需要
    if(ENV === "test" || ENV === "beta"){
        //test/beta获取版本号
        const versionData = await getVersionInfo(ENV);
        console.log(chalk.cyan(`-  当前发布环境为环境为: ${ENV}`));
        console.log(chalk.cyan(`-  当前版本号为: ${versionData.version}`));
        console.log(chalk.cyan(`-  上次更新时间为: ${moment(versionData.updateTime).format("YYYY-MM-DD hh:mm:ss")}`));
        //如果是versionType==1获取手动输入版本号
        const version = await ensureVersion(versionData.version);
        await uploadFile(ENV,version);
        await setAutoUpdate(ENV);
        const newVersionData = await getVersionInfo(ENV);
        console.log(chalk.cyan(`-  新的版本号为：${newVersionData.version}`));
    }
    // 线上环境
    if(ENV === "prod" ){
        const deployVersion = await getDeployVersion();
        await deploy(deployVersion);
    }
}

upload().then(() => {
    console.log(chalk.cyan('\n-------------  发布完成  -----------\n'))
    process.exit();
}).catch(( err ) => {
    console.log(chalk.red('\n-------------  发布失败!!!  -----------\n'))
    process.exit();
});