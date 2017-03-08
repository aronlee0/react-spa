import express from 'express';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import httpProxyMiddleware from 'http-proxy-middleware';
import ip from 'ip';
import chalk from "chalk";

import { devConfig } from '../config.json';

import webpackConfigDev from '../webpack.dev.conf';

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


const webpackCompiler = webpack(webpackConfig)
const devMiddleware = webpackDevMiddleware(webpackCompiler, {
    serverSideRender: true,
    publicPath: webpackCompiler.options.output.publicPath,
    noInfo: true,
    quiet: false,
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
devServer.get('/', function (req, res) {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>品牌公寓-房东</title>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <meta name="renderer" content="webkit">
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
        <link rel="shortcut icon" href="//files.iwjw.com/icon/favicon.ico" type="image/x-icon">
        <link rel="stylesheet" href="common.css">
        <link rel="stylesheet" href="index.css">
    </head>
    <body>
    <!--react spa-->
    <div id="root"></div>
    <script type="text/javascript">
        window.pageConfig={
            siteUrl:location.href,
            user:{
                hasUser: true
            }
        }
    </script>
    <script src="common.js"></script>
    <script src="index.js"></script>
    </body>
    </html>
  `);
});

// devServer.use('/global', express.static('alc/global'));


// 对于IE兼容性测试时的API跨域问题，使用该代理解决
// 代理API，可以在config/mine.js中修改成你想要的代理目标
devServer.use(httpProxyMiddleware('**/*.action', {
    logLevel: 'silent',
    target: "http://127.0.0.1:7002",
    changeOrigin: true
}))
const nohot = false;
devServer.listen(devConfig.port, function () {
    process.stdout.clearLine()
    process.stdout.cursorTo(0)
    console.log(`dev${nohot&&'nohot'||''}-server at ${chalk.magenta.underline(`http://${ip.address()}:${this.address().port}/`)}`)
})