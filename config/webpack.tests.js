/* eslint-disable no-var */

var path = require('path');
var webpack = require('webpack');
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
    new webpack.DefinePlugin({
      __API_URL__: JSON.stringify('https://mock-api.fi'),
    }),
    new HtmlWebpackPlugin({
      inject: true,
    }),
    new webpack.IgnorePlugin(/ReactContext/),
  ],
});
