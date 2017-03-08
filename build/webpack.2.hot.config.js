import webpack from 'webpack'
import ProgressBarPlugin from 'progress-bar-webpack-plugin'
import WebpackNotifierPlugin from 'webpack-build-notifier'
import HtmlWebpackPlugin from 'html-webpack-plugin'
// import HappyPack from 'happypack' // 我们现在不用这个重新构建速度就很快

import eslintFriendlyFormatter from 'eslint-friendly-formatter'
import chalk from 'chalk'
import autoprefixer from 'autoprefixer'
import postcssPxtorem from 'postcss-pxtorem'

import { entry, alias, provide } from './config'

export default {
    entry,
    // devtool: false,
    devtool: 'cheap-module-eval-source-map',
    // devtool: 'source-map',
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
        // preLoaders: [{
        //     test: /\.(vue|js)$/,
        //     exclude: /node_modules/,
        //     loader: 'eslint?cache'
        // }],
        rules: [
            {
                test: /\.js[x]?$/,
                exclude: [/node_modules/,/global\/lib\//],
                use: [
                    "react-hot-loader",
                    // "babel-loader"
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
                // loaders: ['style-loader', 'css-loader', 'postcss-loader']
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'postcss-loader']
                })
            },
            {
                test: /\.less$/,
                // loaders: ['style-loader', 'css-loader', 'postcss-loader', 'less-loader']
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'postcss-loader', 'less-loader']
                })
            },
            {
                test: /\.scss$/,
                // loaders: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'postcss-loader', 'sass-loader']
                })
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
        loaders: [{
            test: /\.vue$/,
            exclude: /node_modules/,
            loader: 'vue'
        }, {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel?cacheDirectory'
        }, {
            test: /\.css$/,
            loaders: ['vue-style', 'css?sourceMap', 'postcss']
        }, {
            test: /\.(png|jpg|gif|woff|woff2|ttf|eot|svg|swf)$/,
            loader: 'url',
            query: {
                limit: 5000,
                name: '[name].[ext]'
            }
        }]
    },
    eslint: {
        formatter: eslintFriendlyFormatter
    },
    postcss: [
        autoprefixer({
            browsers: ['last 2 versions', 'iOS >= 7', 'Android >= 4']
        }),
        // 肯定最好是用postcss，flexible布局生成了太多的[dpr-*]样式，所以不考虑用了，用pxtorem代替（注意：不同于px2rem）
        // https://github.com/cuth/postcss-pxtorem
        /*postcssPxtorem({
            rootValue: 100,
            unitPrecision: 5,
            propList: ['*'],
            // propList: ['*', '!font*'],
            // propList: ['height'],
            propList: ['!*'],
            // selectorBlackList: [/^\.mint/],
            replace: true,
            mediaQuery: false,
            minPixelValue: 0
        })*/
    ],
    vue: {
        loaders: {
            sass: 'vue-style!css?sourceMap!postcss!sass?sourceMap'
        }
    },
    plugins: [
        new ProgressBarPlugin({
            format: `${chalk.bold('[:bar]')} ${chalk.cyan.bold(':percent (:elapseds)')} :msg`,
            clear: true,
            summary: false,
            summaryContent: false,
            customSummary (buildTime) {
                process.stdout.write(`=====${chalk.green.bold(`[ built in ${buildTime} ]`)}=====`)
            }
        }),
        // https://github.com/RoccoC/webpack-build-notifier
        new WebpackNotifierPlugin({
            title: '开发服务器',
            logo: 'app/global/img/logo.png',
            successSound: 'Submarine',
            failureSound: 'Glass',
            suppressSuccess: true
        }),

        new webpack.ProvidePlugin(provide),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"development"'
            },
            __DEV__: true,
            __PROD__: false
        }),
        // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),

        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: Infinity // 不需要抽取公共代码到这个文件中
        }),
        // https://github.com/ampedandwired/html-webpack-plugin
        new HtmlWebpackPlugin({
            chunks: ['vendor', 'app'],
            filename: 'index.html',
            template: 'app.html',
            inject: true
        })
    ]
}
