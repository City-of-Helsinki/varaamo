/* eslint-disable no-var */

var path = require('path');
var webpack = require('webpack');
var merge = require('webpack-merge');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var common = require('./webpack.common');

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
        loader: ExtractTextPlugin.extract('style', 'css!postcss-loader'),
      },
      {
        test: /\.less$/,
        loader: ExtractTextPlugin.extract('style', 'css!postcss-loader!less'),
      },
    ],
  },
  plugins: [
    // Important to keep React file size down
    new webpack.DefinePlugin({
      __API_URL__: JSON.stringify(process.env.API_URL || 'https://api.hel.fi/respa/v1'),
      __DEVTOOLS__: false,
      __TRACKING__: Boolean(process.env.PIWIK_SITE_ID),
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
    new ExtractTextPlugin('app.css'),
  ],
});
