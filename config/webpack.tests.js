const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const common = require('./webpack.common');

module.exports = merge(common, {
  externals: {
    cheerio: 'window',
    'react/lib/ExecutionEnvironment': true,
    'react/lib/ReactContext': true,
  },
  module: {
    preLoaders: [],
    loaders: [
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, '../app'),
          path.resolve(__dirname, '../tests'),
          path.resolve(__dirname, './'),
        ],
        loader: 'babel',
        query: {
          presets: ['es2015', 'node6', 'react', 'stage-2'],
        },
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      __API_URL__: JSON.stringify('https://mock-api.fi'),
      __TRACKING__: false,
    }),
    new HtmlWebpackPlugin(),
    new webpack.IgnorePlugin(/ReactContext/),
  ],
});
