const path = require('path');

require('dotenv').load({ path: path.resolve(__dirname, '../.env') });

const webpack = require('webpack');
const merge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const common = require('./webpack.common');

module.exports = merge(common, {
  entry: [
    'babel-polyfill',
    path.resolve(__dirname, '../app/index.js'),
  ],
  debug: false,
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/_assets/',
    filename: 'app.js',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, '../app'),
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'node6', 'react', 'stage-2'],
        },
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style', 'css-loader!postcss-loader'),
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('style', 'css-loader!resolve-url-loader!postcss-loader!sass-loader'),
      },
    ],
  },
  plugins: [
    // Important to keep React file size down
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
      SETTINGS: {
        API_URL: JSON.stringify(process.env.API_URL || 'https://api.hel.fi/respa/v1'),
        SHOW_TEST_SITE_MESSAGE: Boolean(process.env.SHOW_TEST_SITE_MESSAGE),
        TRACKING: Boolean(process.env.PIWIK_SITE_ID),
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
