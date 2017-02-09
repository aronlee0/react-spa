/**
 * Created by huangxiaogang on 16/8/3.
 * webpack打包相关
 */
var webpack = require("webpack"),
    CopyWebpackPlugin = require('copy-webpack-plugin'),
    ExtractTextPlugin = require("extract-text-webpack-plugin"),
    WebpackNotifierPlugin = require('webpack-notifier'),
    extend = require('extend'),
    path= require('path');

var alias = require('./configuration/alias.js');

var entry_file = {
  react: ['react','react-dom'],
  common: [
    './iconfont/iconfont.css',
    './index/index.js'
  ]
};
var webpackPluginList =[
            new CopyWebpackPlugin([
                    {
                        from: 'index/index.html',
                        to: 'index.html'
                    }
            ]),
            new webpack.optimize.DedupePlugin(),
            new WebpackNotifierPlugin({
                title: 'Webpack 编译成功',
                // contentImage: path.resolve(process.cwd(), './global/img/logo.png'),
                alwaysNotify: true
            }),
            new ExtractTextPlugin("[name].css"),
            new webpack.optimize.CommonsChunkPlugin({
                name: 'common',
                minChunks: Infinity
            })
        ];
//webpack配置文件
module.exports =  {
        watch: true,
        entry: entry_file,
        debug: true,
        devtool: 'source-map',
        output: {
            path: path.resolve(process.cwd(),'dist/'),
            filename: '[name].js',
            chunkFilename: '[name].min.js',
            publicPath: ''
        },
        resolve: alias,
        plugins: webpackPluginList,
        module: {
            loaders: [{
                test: /\.js$/,
                exclude: /(node_modules)/,
                loader: 'babel'
            }, {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css')
            },{
                test: /\.rcss$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader?modules&sourceMap&-convertValues!sass-loader?sourceMap')
            }, {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader?-convertValues!less-loader')
            }, {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader?sourceMap&-convertValues!sass-loader?sourceMap')
            }, {
                test: /\.(png|jpg|gif|woff|woff2|ttf|eot|svg|swf)$/,
                loader: "file-loader?name=[name]_[sha512:hash:base64:7].[ext]"
            }, {
                test: /\.html/,
                loader: "html-loader?" + JSON.stringify({
                    minimize: false,
                    attrs:false
                })
            },
                {
                 test: /\.json$/,
                 loader: "json"
                }
            ]
        }
    };
