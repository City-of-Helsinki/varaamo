/* eslint-disable no-var */

var ExtractTextPlugin = require('extract-text-webpack-plugin');
var path = require('path');
var webpack = require('webpack');
var merge = require('webpack-merge');

var common = require('./webpack.common');

var extractCustomStyles = new ExtractTextPlugin('espoo.css');

module.exports = merge(common, {
  entry: [
    'webpack-hot-middleware/client?reload=true',
    path.resolve(__dirname, '../app/index.js'),
  ],
  debug: true,
  devtool: 'cheap-module-eval-source-map',
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'app.js',
    publicPath: '/',
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
        exclude: path.resolve(__dirname, '../node_modules'),
        loader: 'babel',
        query: {
          'stage': 2,
          'plugins': ['react-transform'],
          'extra': {
            'react-transform': {
              'transforms': [{
                'transform': 'react-transform-hmr',
                'imports': ['react'],
                'locals': ['module'],
              }, {
                'transform': 'react-transform-catch-errors',
                'imports': ['react', 'redbox-react'],
              }],
            },
          },
        },
      },
      {
        test: /\.css$/,
        loader: 'style!css!postcss-loader',
      },
      {
        test: /\.less$/,
        exclude: path.resolve(__dirname, '../app/assets/styles/customization'),
        loader: 'style!css!postcss-loader!less',
      },
      {
        test: /\.less$/,
        include: path.resolve(__dirname, '../app/assets/styles/customization'),
        loader: extractCustomStyles.extract(['css', 'less']),
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
      __API_URL__: JSON.stringify(process.env.API_URL || 'https://api.hel.fi/respa-test/v1'),
      __DEVTOOLS__: false,
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    extractCustomStyles,
  ],
});
