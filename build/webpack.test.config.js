var webpack = require('webpack');
var path = require('path');
var extend = require('extend');
var alias = require('./configuration/alias.js');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var BellOnBundlerErrorPlugin = require('bell-on-bundler-error-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var OpenBrowserPlugin = require('open-browser-webpack-plugin'); //自动打开浏览器插件

// var myloader = require('./Myloader');
console.log(__dirname);
const currentRootPath = process.cwd();


// console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%",process.cwd());
console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%",path.resolve(currentRootPath, 'node_modules'));

var entry = {
  react: ['react','react-dom','react-router','redux'],
  common: [
    'antd/dist/antd.less',
    './views/index.js'
  ]
}

var config = {
    // context: path.resolve(__dirname),//By default the current directory is used, but it's recommended to pass a value in your configuration. This makes your configuration independent from CWD (current working directory).
    watch: true,
    watchOptions:{
        aggregateTimeout: 800,
        poll: false,
        ignored: /node_modules/
    },
    // 配置服务器
    devServer: {
        contentBase: path.resolve(currentRootPath, 'dist'), 
        clientLogLevel: "info",
        compress: true,
        historyApiFallback: true,
        hot: true,
        hotOnly: true,
        inline: true,
        progress: true,
        port: 8798,
        proxy: {
            "/api": {
                target: "http://localhost:7003",
                pathRewrite: {"^/api" : ""}
            }
        },
        /**
         * Tell the server to watch the files served by the devServer.contentBase option. File changes will trigger a full page reload.
         * It is disabled by default.
         */
        watchContentBase: true
    },
    entry: entry,
    //   debug: true,
    devtool: 'source-map',
    // output: {
    //   path: 'dist',
    //   filename: '[name].js'
    // },
    output: {
        path: path.resolve(process.cwd(),'dist/'),
        filename: '[name].js',
        chunkFilename: '[name].[chunkhash:7].js',
        publicPath: ''
    },
    module:{
        //加载器配置
        loaders: [
            {
                test: /\.jade$/,
                exclude: /node_modules/,
                loader: "jade-loader"
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "happypack/loader?id=css"
                })
            },
            {
                test: /\.rcss$/,
                loader: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader?modules&sourceMap&-convertValues!sass-loader?sourceMap"
                })
            },
            {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader?-convertValues!less-loader"
                })
            },
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader?sourceMap&-convertValues!sass-loader?sourceMap"
                })
            },
            {
                test: /\.vue$/,
                exclude: /node_modules/,
                loader: 'vue-loader'
            },
            {
                test: /\.(png|jpg|gif|woff|woff2|ttf|eot|svg|swf)$/,
                loader: "file-loader?name=[name]_[sha512:hash:base64:7].[ext]"
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            // {
            //   test: /\.js$/,
            //   exclude: (/node_modules/)|(/views\/([^\/]+\/[^\/]+).js$/),
            //   loader: 'babel'
            // },
            // {
            //   test: routeComponentRegex,
            //   // include: path.resolve(__dirname, 'src'),
            //   loaders: [__dirname + '/Myloader/index.js?lazy', 'babel']
            // },
            {
                test: /\.html$/,
                loader: "html?" + JSON.stringify({
                    minimize: false,
                    attrs:false
                })
            },
            {
                test: /\.json$/,
                loader: 'json'
            }
        ]
    },
    resolve: {
        alias: {
            React$:"react"
        },
        modules: [path.resolve(currentRootPath, 'node_modules')]
    },
    plugins: [
        new CleanWebpackPlugin(['dist'],{
        root: currentRootPath,  // 一个根的绝对路径, [webpack.config的地址]
        verbose: true,      // 将log写到 console.
        dry: false,         // 不要删除任何东西，主要用于测试.
        exclude: ['']       //排除不删除的目录，主要用于避免删除公用的文件
        }),
        new BellOnBundlerErrorPlugin(),
        new CopyWebpackPlugin([
        {
            from: 'views/index.html',
            to: 'index.html'
        }
        ],{}),
        // new webpack.ProvidePlugin({
        //   Vue: 'vue',
        //   VueRouter: 'vue-router'
        // }),
        /**
         * 在webpack2里DedupePlugin 和 OccurrenceOrderPlugin这两个插件已经被移除了因为这些功能已经被内置了。
         */
        // new webpack.optimize.DedupePlugin(),
        new ExtractTextPlugin('[name].css'),
        new webpack.optimize.CommonsChunkPlugin({
            name: ['common','react'],
            minChunks: Infinity
        }),
        new webpack.HotModuleReplacementPlugin(),
        new OpenBrowserPlugin({ url: 'http://localhost:8798/index.html' })
    ]

};



module.exports = config;
