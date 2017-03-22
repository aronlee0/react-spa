import webpack from "webpack";
import webpackDevServer from 'webpack-dev-server';
import { resolve } from 'path'
import webpackConf from "../webpack.config.js";
import { staticPublicPath } from "../config.json";

const publicPath = staticPublicPath["dev"] || "/";
webpackConf.output.publicPath = publicPath


webpackConf.entry = [
    'react-hot-loader/patch',
    // 开启 React 代码的模块热替换(HMR)

    'webpack-dev-server/client?http://localhost:8080',
    // 为 webpack-dev-server 的环境打包代码
    // 然后连接到指定服务器域名与端口

    'webpack/hot/only-dev-server',
    // 为热替换(HMR)打包好代码
    // only- 意味着只有成功更新运行代码才会执行热替换(HMR)
    
    './src/index.js'
    // 我们 app 的入口文件
];
// webpackConf.context = resolve(process.cwd(), 'src')
webpackConf.devtool = 'inline-source-map'
webpackConf.devServer = {
    hot: true,
    // 开启服务器的模块热替换(HMR)

    contentBase: resolve(process.cwd(), 'dist'),
    // 输出文件的路径

    publicPath: publicPath
    // 和上文 output 的“publicPath”值保持一致
}
const HotModuleReplacementPlugin = new webpack.HotModuleReplacementPlugin()
const NamedModulesPlugin = new webpack.NamedModulesPlugin()
webpackConf.plugins = webpackConf.plugins.concat([ HotModuleReplacementPlugin, NamedModulesPlugin ]);

const compiler = webpack(webpackConf)

new webpackDevServer(compiler,{})