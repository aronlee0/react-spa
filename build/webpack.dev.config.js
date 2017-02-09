var webpack = require('webpack');
var path = require('path');
var extend = require('extend');
var alias = require('./configuration/alias.js');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var BellOnBundlerErrorPlugin = require('bell-on-bundler-error-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

// var myloader = require('./Myloader');
console.log(__dirname);
const currentPath = process.cwd();

var entry = {
  react: ['react','react-dom','react-router','redux'],
  common: [
    'antd/dist/antd.less',
    './views/index.js'
  ]
}

var routeComponentRegex = /views\/([^\/]+\/[^\/]+).js$/ 
// var routeComponentRegex = /views\/([^\/]+\/)+[^\/]+.js$/ 

var config = {
  watch: true,
  entry: entry,
  debug: true,
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
        loader: "jade"
      },
      {
          test: /\.css$/,
          loader: ExtractTextPlugin.extract("style", "css")
      },
      {
          test: /\.rcss$/,
          loader: ExtractTextPlugin.extract('style-loader', 'css-loader?modules&sourceMap&-convertValues!sass-loader?sourceMap')
      },
      {
        test: /\.less$/,
        loader: ExtractTextPlugin.extract('style', 'css?-convertValues!less')
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('style', 'css?sourceMap&-convertValues!sass?sourceMap')
      },
      {
        test: /\.vue$/,
        exclude: /node_modules/,
        loader: 'vue'
      },
      {
          test: /\.(png|jpg|gif|woff|woff2|ttf|eot|svg|swf)$/,
          loader: "file-loader?name=[name]_[sha512:hash:base64:7].[ext]"
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel'
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
  resolve: alias,
  plugins: [
    new CleanWebpackPlugin(['dist'],{
      root: currentPath,  // 一个根的绝对路径, [webpack.config的地址]
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
    new webpack.optimize.DedupePlugin(),
    new ExtractTextPlugin('[name].css'),
    new webpack.optimize.CommonsChunkPlugin({
        name: ['common','react'],
        minChunks: Infinity
    })
  ]

};



module.exports = config;
