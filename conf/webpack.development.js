/* eslint-disable no-var */

var path = require('path');
var webpack = require('webpack');
var merge = require('webpack-merge');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var common = require('./webpack.common');

module.exports = merge(common, {
  entry: [
    'webpack-dev-server/client?http://localhost:3030',
    'webpack/hot/dev-server',
    path.resolve(__dirname, '../app/index.js'),
  ],
  debug: true,
  devtool: 'cheap-module-eval-source-map',
  output: {
    path: path.resolve(__dirname, '../build'),
    publicPath: 'http://localhost:3030/',
    filename: 'app.js',
  },
  module: {
    preLoaders: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, '../app'),
        loader: 'eslint',
      },
    ],
    loaders: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, '../app'),
        loaders: ['react-hot', 'babel'],
      },
      {
        test: /\.css$/,
        loader: 'style!css!postcss-loader',
      },
      {
        test: /\.less$/,
        loader: 'style!css!postcss-loader!less',
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      __DEVTOOLS__: true,
    }),
    new HtmlWebpackPlugin({
      favicon: './app/assets/images/favicon.ico',
      inject: true,
      template: './conf/template.html',
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
  ],
});
