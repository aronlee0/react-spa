import webpack from 'webpack'
import moment from "moment"
import os from "os"
import HappyPack from "happypack"
import ProgressBarPlugin from 'progress-bar-webpack-plugin'
import CleanWebpackPlugin from 'clean-webpack-plugin'
import WebpackNotifierPlugin from 'webpack-build-notifier'
import ExtractTextPlugin from "extract-text-webpack-plugin"
import CopyWebpackPlugin from 'copy-webpack-plugin'
import chalk from 'chalk'
import autoprefixer from 'autoprefixer'
import cssgrace from 'cssgrace'
import extend from 'extend'
import path from 'path'
import { uploadDir } from './config.json'

import { alias, entry, copy } from "./entires_alias"

const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });

// const NodeEnv = process.env.NODE_ENV;

// https://github.com/webpack/loader-utils/issues/56
process.traceDeprecation = true;

export default {
    watch: true,
    watchOptions: {
        aggregateTimeout: 800
    },
    entry: entry,
    devtool: 'cheap-eval-source-map',
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
                    // "react-hot-loader",
                    {
                        loader: "babel-loader?cacheDirectory"/*,
                        options: {
                            cacheDirectory: true
                        }*/
                    }
                ]
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [{
                        loader: 'css-loader?modules'
                    }, 'postcss-loader']
                })
            },
            {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [{
                        loader: 'css-loader?modules'
                    }, 'postcss-loader', 'less-loader']
                })
            },
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [{
                        loader: 'css-loader?modules'
                    }, 'postcss-loader', 'sass-loader']
                })
            },
            {
                test: /\.html/,
                loader: "html-loader",
                options: {
                    minimize: false,
                    attrs:false
                }
            }, 
            {
                test: /\.(png|jpg|gif|woff|woff2|ttf|eot|svg|swf)$/,
                use: [
                    {
                        loader: "file-loader?name=[name]_[sha512:hash:base64:7].[ext]",
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
                const now = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
                process.stdout.write(`=====[ it took ${chalk.blue(buildTime)} to build at ${chalk.blue(now)} ]=====`)
            }
        }),
        new CopyWebpackPlugin(copy),
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
            _: 'underscore'
        }),
        new WebpackNotifierPlugin({
            title: 'Webpack 编译成功',
            contentImage: path.resolve(process.cwd(), './global/img/logo.png'),
            alwaysNotify: true
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: ['common','react'],
            minChunks: Infinity
        }),
        // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
        // new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    ]
}