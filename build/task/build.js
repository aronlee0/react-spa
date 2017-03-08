import webpack from "webpack";
import request from "request";
import moment from "moment";
import UglifyJSPlugin from "uglifyjs-webpack-plugin";
import webpackConf from "../webpack.config.js";
import { name as packageName } from "../../package.json";

import promptly from "promptly";
import chalk from "chalk";
import { uploadDir, staticPublicPath, serverEnv, api, versionType } from "../config.json";
import ZipWebpackPlugin from "zip-webpack-plugin";

import path from "path";
 
const defaultPublicPath = "http://127.0.0.1/iwjw-rent-console/";

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
// console.log(staticPublicPath);

// export default async function(){
//     console.log(chalk.cyan('\n----------  准备上线  -----------'));
// }

function startCompire(){
    return new Promise(( resolve, reject ) => {
        webpack(webpackConf, function(err, stats) {
            if (err) {
                throw err;
            }
            process.stdout.clearLine()
            process.stdout.cursorTo(0)
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
                return
            }
            resolve();
        });
    });
}


function chooseEnv(){
    return new Promise(( resolve, reject) => {
        promptly.choose(
            `请选择发布 ${chalk.yellow.bold('test/beta/prod')} 环境:`,
            ["test","beta","prod"],
            (err,value) => {
                if(err)reject(err);
                if(webpackConf.output){
                    webpackConf.output.publicPath = staticPublicPath[value] || defaultPublicPath;
                }
                if(value === "prod"){
                    webpackConf.plugins = webpackConf.plugins.concat([ UglifyPlugin, ZipPlugin ]);
                }
                resolve(value);
            }
        );
    });
}

function getVersion(env){
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
                reject(err || body)
            } else {
                resolve(body.data)
            }
        });
    });
}

function uploadFile(env){
    const options = {
        url, 
        formData: {
            project: serverEnv[env]["projectId"],
            versionType: versionType,
            version: _input.version,
            isCoverVer: 1,
            file: fs.createReadStream(config.zipFilePath)
        }, 
        json: true
    }
    promptly
    return new Promise(( resolve, reject ) => {
        console.log(options);
        // request.post(options, (err, httpResponse, body) => {
        //     // console.log(err, body)
        //     if (err) {
        //         reject(err)
        //     } else {
        //         resolve()
        //     }
        // })
        resolve()
    });
}


// chooseEnv().then(()=>{
//     startCompire();
//     console.log(chalk.cyan('\n-------------^__^-----编译成功---------'));
// });
async function upload(){
    console.log(chalk.cyan('\n-------------  准备发布  -----------\n'));
    //选择发布环境
    const ENV = await chooseEnv();
    //webpack编译
    await startCompire();
    chalk.cyan('\n-------------  编译完成  -----------\n')
    //test/beta获取版本号
    if(ENV === "test" || ENV === "beta"){
        const versionData = await getVersion(ENV);
        console.log(chalk.cyan(`-  当前发布环境为环境为${ENV}`));
        console.log(chalk.cyan(`-  当前版本号为: ${versionData.version}`));
        console.log(chalk.cyan(`-  上次更新时间为:${moment(versionData.updateTime).format("YYYY-MM-DD hh:mm:ss")}`));
        // await uploadFile(ENV);
    }
    // const resourceVersion = await getVersion()
    // console.log(`版本号：${chalk.yellow.bold(resourceVersion.version)} ${new Date(resourceVersion.updateTime).toLocaleString()}`)

    // await uploadAuto(resourceVersion.version)
    // console.log(chalk.magenta(`    已上传至${chalk.cyan.bold(_input.env)}环境`))

    // await openAuto()
    // _input.openAuto && console.log(chalk.magenta(`    自动更新已打开^_^`))

    // // check version
    // const checkVersion = await getVersion(true)
    // console.log(`\n最新版本号：${chalk.yellow.bold(checkVersion.version)} ${new Date(checkVersion.updateTime).toLocaleString()}`)

    // console.log(chalk.cyan('\n--------- 发布结束 -------'))
}

upload().then(() => {
    console.log(chalk.cyan('\n-------------  编译完成  -----------\n'))
}).catch(( err ) => {

});