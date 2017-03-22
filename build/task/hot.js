import express from 'express';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import httpProxyMiddleware from 'http-proxy-middleware';
import ip from 'ip';
import chalk from "chalk";
// import indexHtml from "../../views/index.html"

import { devPort } from '../config.json';

import webpackConfigDev from '../webpack.config.js';

const webpackConfig = webpackConfigDev;

const hotclient = ['webpack-hot-middleware/client?noInfo=true&reload=true']
const entry = webpackConfig.entry
Object.keys(entry).forEach((name) => {
    const value = entry[name]
    if (Array.isArray(value)) {
        value.unshift(...hotclient)
    } else {
        entry[name] = [...hotclient, value]
    }
})

const HotModuleReplacementPlugin = new webpack.HotModuleReplacementPlugin()
const NamedModulesPlugin = new webpack.NamedModulesPlugin()
webpackConfig.plugins = webpackConfig.plugins.concat([ HotModuleReplacementPlugin, NamedModulesPlugin ]);

const webpackCompiler = webpack(webpackConfig)
const devMiddleware = webpackDevMiddleware(webpackCompiler, {
    serverSideRender: true,
    publicPath: webpackCompiler.options.output.publicPath,
    noInfo: true,
    hot: true,
    quiet: false,
    inline: true,
    stats: {
        colors: true,
        hash: false,
        version: false,
        timings: false,
        assets: false,
        chunks: false,
        children: false
    }
})
const hotMiddleware = webpackHotMiddleware(webpackCompiler, {
    log: false
})

const devServer = express();



devServer.use(devMiddleware);
devServer.use(hotMiddleware);

// devServer.use('/', express.static('dist'));

// devServer.use('/global', express.static('alc/global'));
devServer.get('/',( req, res ) => {
    res.send("nihao")
});


// 对于IE兼容性测试时的API跨域问题，使用该代理解决
// 代理API，可以在config/mine.js中修改成你想要的代理目标
devServer.use(httpProxyMiddleware('**/*.action', {
    logLevel: 'silent',
    target: "http://127.0.0.1:7002",
    changeOrigin: true
}))
const nohot = false;
devServer.listen(devPort, function () {
    process.stdout.clearLine()
    process.stdout.cursorTo(0)
    console.log(`dev${nohot&&'nohot'||''}-server at ${chalk.magenta.underline(`http://${ip.address()}:${this.address().port}/`)}`)
})