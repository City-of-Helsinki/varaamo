const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const merge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const common = require('./webpack.common');

module.exports = merge(common, {
  externals: {
    cheerio: 'window',
    'react/addons': true,
    'react/lib/ExecutionEnvironment': true,
    'react/lib/ReactContext': true
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, '../app'),
          path.resolve(__dirname, './')
        ],
        use: ['babel-loader'],
        query: {
          plugins: [
            ['istanbul', {
              exclude: [
                '**/*.spec.js',
                '**/specs.bootstrap.js'
              ]
            }]
          ]
        }
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style', 'css-loader!postcss-loader')
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('style', 'css-loader!resolve-url-loader!postcss-loader!sass-loader')
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      SETTINGS: {
        API_URL: JSON.stringify('https://mock-api.fi'),
        TRACKING: false
      }
    }),
    new HtmlWebpackPlugin(),
    new webpack.IgnorePlugin(/ReactContext/),
    new ExtractTextPlugin('app.css')
  ]
});
