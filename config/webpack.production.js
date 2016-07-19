/* eslint-disable no-var */

var path = require('path');
var webpack = require('webpack');
var merge = require('webpack-merge');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var common = require('./webpack.common');

var extractCustomStyles = new ExtractTextPlugin('espoo.css');
var extractStyles = new ExtractTextPlugin('app.css');

module.exports = merge(common, {
  entry: path.resolve(__dirname, '../app/index.js'),
  debug: false,
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: '',
    filename: 'app.js',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, '../app'),
        loaders: ['babel'],
      },
      {
        test: /\.css$/,
        loader: extractStyles.extract('style', 'css!postcss-loader'),
      },
      {
        test: /\.less$/,
        exclude: path.resolve(__dirname, '../app/assets/styles/customization'),
        loader: extractStyles.extract('style', 'css!postcss-loader!less'),
      },
      {
        test: /\.less$/,
        include: path.resolve(__dirname, '../app/assets/styles/customization'),
        loader: extractCustomStyles.extract(['css', 'less']),
      },
    ],
  },
  plugins: [
    // Important to keep React file size down
    new webpack.DefinePlugin({
      __API_URL__: JSON.stringify(process.env.API_URL || 'https://api.hel.fi/respa/v1'),
      __DEVTOOLS__: false,
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        screw_ie8: true,
        warnings: false,
      },
    }),
    extractStyles,
    extractCustomStyles,
  ],
});
