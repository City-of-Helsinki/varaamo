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
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
    }),
  ],
});
