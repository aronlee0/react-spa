import webpack from 'webpack';
import os from "os";
import HappyPack from "happypack";
import ProgressBarPlugin from 'progress-bar-webpack-plugin';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import WebpackNotifierPlugin from 'webpack-build-notifier';
import ExtractTextPlugin from "extract-text-webpack-plugin";
import chalk from 'chalk';
import autoprefixer from 'autoprefixer';
import cssgrace from 'cssgrace';
import extend from 'extend';
import path from 'path';
import { versionType, uploadDir } from './config.json';

import { alias, entries } from "./files_config";

const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });

//切换打包方式为manifest，给后端读取json文件
const ManifestPlugin = require('./plugins/manifest.js');

const NodeEnv = process.env.NODE_ENV;

// https://github.com/webpack/loader-utils/issues/56
// process.traceDeprecation = true;

export default {
    watch: true,
    entry: entries,
    devtool: 'source-map',
    output: {
        path: `${process.cwd()}/dist`,
        publicPath: '/',
        filename: '[name].js',
        chunkFilename: '[name].[chunkhash:7].js', //非入口文件的命名规则
    },
    resolve: {
        alias: alias
    },
    module: {
        rules: [
            {
                test: /\.js[x]?$/,
                exclude: [/node_modules/,/global\/lib\//],
                use: [
                    "react-hot-loader",
                    {
                        loader: "babel-loader",
                        options: {
                            cacheDirectory: true
                        }
                    }
                ]
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'postcss-loader']
                })
            },
            {
                test: /\.less$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'postcss-loader', 'less-loader']
                })
            },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'postcss-loader', 'sass-loader']
                })
            },
            {
                test: /\.html/,
                loader: "html-loader",
                query: {
                    minimize: false,
                    attrs:false
                }
            }, 
            {
                test: /\.(png|jpg|gif|woff|woff2|ttf|eot|svg|swf)$/,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            name: '[name]_[sha512:hash:base64:7].[ext]'
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        /*new HappyPack({
            id: 'js',
            threadPool: happyThreadPool,
            loaders: ['react-hot-loader', 'babel-loader']
        }),
        new HappyPack({
            id: 'scss',
            threadPool: happyThreadPool,
            loaders: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader']
        }),*/
        new ProgressBarPlugin({
            format: `${chalk.bold('[:bar]')} ${chalk.cyan.bold(':percent (:elapseds)')} :msg`,
            clear: true,
            summary: false,
            summaryContent: false,
            customSummary (buildTime) {
                process.stdout.write(`-------------^__^-----编译成功,共使用${buildTime}---------\n`)
            }
        }),
        new ExtractTextPlugin({
            filename: "[name].css",
            disable: false,
            allChunks: true
        }),
        new CleanWebpackPlugin(['dist', uploadDir], {
            root: `${process.cwd()}`
        }),
        new webpack.LoaderOptionsPlugin({
            options: {
                postcss: [
                    autoprefixer({
                        browsers: ['> 5%', 'last 2 versions', 'IE >= 8']
                    }),
                    // https://github.com/cssdream/cssgrace
                    cssgrace
                ]
            }
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            _: 'underscore',
            global: 'global',
            iwjw: 'iwjw',
            smallnote:'smallnote',
            React: 'react',
            ReactDOM: 'react-dom',
            antd: 'antd',
            store:'store'
        }),
        new WebpackNotifierPlugin({
            title: 'Webpack 编译成功',
            contentImage: path.resolve(process.cwd(), './global/img/logo.png'),
            alwaysNotify: true
        }),
        // new ExtractTextPlugin("[name].css"),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'common',
            minChunks: Infinity
        }),
        // new webpack.DefinePlugin({
        //     'process.env': {
        //         NODE_ENV: process.env['npm_config_argv'].match('dev_base')?'"development"':'"production"'
        //     }
        // }),
        // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
        // new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        //manifest上传方式配置，这边先不用 versionType==2
        new ManifestPlugin({
            versionFiles:[
                'common.js',
                'index.js',
                'common.css',
                'index.css'
            ],
            hashNum:7,
            //是否抽取css/js资源加版本号，这块相当于兼容versionType==0的情况
            extractJsCss:false
        })
    ]
}