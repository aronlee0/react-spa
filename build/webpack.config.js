
// import webpack from 'webpack';
// import path from 'path';
// import alias from './alias.js';
var webpack = require('webpack');
var path = require('path');
var extend = require('extend');
var alias = require('./alias.js');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var BellOnBundlerErrorPlugin = require('bell-on-bundler-error-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

const currentPath = process.cwd();

var staticfile = require('./staticfile.js');

var entry = extend(common,staticfile);
// console.log(entry);



var config = {
  watch: true,
  entry: entry,
  output: {
    path: 'static/dist',
    filename: '[name].js'
  },
  module:{
    //加载器配置
    loaders: [
      {
        test: /\.jade$/,
        exclude: /node_modules/,
        loader: "jade"
      },
      // => "jade" loader is used for ".jade" files
      { test: /\.css$/, loader: "style!css"},
      // => "style" and "css" loader is used for ".css" files
      // Alternative syntax:
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract("style-loader","css-loader")
      },
      {
        test: /\.less$/,
        loader: ExtractTextPlugin.extract("style-loader","css-loader!less-loader")
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract("style-loader","css-loader!sass-loader")
      },
      {
        test: /\.vue$/,
        exclude: /node_modules/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.html$/,
        loader: "html-loader?" + JSON.stringify({
            minimize: false,
            attrs:false
        })
      }
    ]
  },
  resolve: alias,
  plugins: [
    new CleanWebpackPlugin(['static/dist'],{
      root: currentPath,  // 一个根的绝对路径, [webpack.config的地址]
      verbose: true,      // 将log写到 console.
      dry: false,         // 不要删除任何东西，主要用于测试.
      exclude: ['']       //排除不删除的目录，主要用于避免删除公用的文件
    }),
    new BellOnBundlerErrorPlugin(),
    new CopyWebpackPlugin([
      {
        from: 'index/index.html',
        to: 'index.html'
      }
    ],{}),
    // new webpack.ProvidePlugin({
    //   Vue: 'vue',
    //   VueRouter: 'vue-router'
    // }),
    new webpack.optimize.DedupePlugin(),
    new ExtractTextPlugin('[name].css')
  ]

};



module.exports = config;
