/* eslint-disable no-var */

var path = require('path');
var merge = require('webpack-merge');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var common = require('./webpack.common');

module.exports = merge(common, {
  module: {
    preLoaders: [],
    loaders: [
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, '../app'),
          path.resolve(__dirname, '../tests'),
        ],
        loaders: ['babel'],
      },
      {
        test: /\.css$/,
        loader: 'style!css!postcss-loader',
      },
      {
        test: /\.scss$/,
        loader: 'style!css!postcss-loader!sass',
      },
    ],
    noParse: [
      /\/sinon.js/,
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      favicon: './app/images/favicon.ico',
      inject: true,
      template: './conf/template.html',
    }),
  ],
});
