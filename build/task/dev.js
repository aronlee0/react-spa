import webpack from "webpack";
import webpackConf from "../webpack.config.js";
import { staticPublicPath } from "../config.json";

webpackConf.output.publicPath = staticPublicPath["dev"] || "/";

webpack(webpackConf, function(err, stats) {
    process.stdout.clearLine()
    process.stdout.cursorTo(0)
    if (err) {
        console.error(err.stack || err);
        if (err.details) {
        console.error(err.details);
        }
        return;
    }

    const info = stats.toJson();

    if (stats.hasErrors()) {
        console.error(info.errors);
    }

    if (stats.hasWarnings()) {
        console.warn(info.warnings)
    }
    // var log = stats.toString({
        
    //     // 增加资源信息
    //     assets: false,
    //     // 对资源按指定的项进行排序
    //     // assetsSort: "field",
    //     // 增加缓存了的（但没构建）模块的信息
    //     cached: false,
    //     // 增加子级的信息
    //     children: false,
    //     // 增加包信息（设置为 `false` 能允许较少的冗长输出）
    //     chunks: false,
    //     // 将内置模块信息增加到包信息
    //     chunkModules: false,
    //     // 增加包 和 包合并 的来源信息
    //     // chunkOrigins: true,
    //     // 对包按指定的项进行排序
    //     // chunksSort: "field",
    //     // 用于缩短请求的上下文目录
    //     // context: "../src/",
    //     // `webpack --colors` 等同于
    //     // 增加控制台颜色开关
    //     colors: true,
    //     // 增加错误信息
    //     errors: true,
    //     // 增加错误的详细信息（就像解析日志一样）
    //     // errorDetails: true,
    //     // 增加编译的哈希值
    //     // hash: true,
    //     // 增加内置的模块信息
    //     // modules: true,
    //     // 对模块按指定的项进行排序
    //     // modulesSort: "field",
    //     // 增加 publicPath 的信息
    //     // publicPath: true,
    //     // 增加模块被引入的原因
    //     // reasons: true,
    //     // 增加模块的源码
    //     // source: true,
    //     // 增加时间信息
    //     timings: true,
    //     // 增加 webpack 版本信息
    //     version: true,
    //     // 增加提示
    //     // warnings: true
    // });
    // console.log(log);
})