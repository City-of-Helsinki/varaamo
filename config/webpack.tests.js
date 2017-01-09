const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const merge = require('webpack-merge');

const common = require('./webpack.common');

module.exports = merge(common, {
  externals: {
    cheerio: 'window',
    'react/addons': true,
    'react/lib/ExecutionEnvironment': true,
    'react/lib/ReactContext': true,
  },
  devtool: 'inline-source-map',
  module: {
    preLoaders: [],
    loaders: [
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, '../app'),
          path.resolve(__dirname, './'),
        ],
        loader: 'babel',
        query: {
          plugins: [
            ['istanbul', {
              exclude: [
                '**/*.spec.js',
                '**/specs.bootstrap.js',
              ],
            }],
          ],
          presets: ['es2015', 'node6', 'react', 'stage-2'],
        },
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      SETTINGS: {
        API_URL: JSON.stringify('https://mock-api.fi'),
        TRACKING: false,
      },
    }),
    new HtmlWebpackPlugin(),
    new webpack.IgnorePlugin(/ReactContext/),
  ],
});
