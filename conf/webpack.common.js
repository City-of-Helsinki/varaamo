/* eslint-disable no-var */

var autoprefixer = require('autoprefixer');
var path = require('path');

module.exports = {
  module: {
    loaders: [
      {
        test: /\.png$/,
        loader: 'url?limit=100000&mimetype=image/png',
      },
      {
        test: /\.svg$/,
        loader: 'url?limit=100000&mimetype=image/svg+xml',
      },
      {
        test: /\.gif$/,
        loader: 'url?limit=100000&mimetype=image/gif',
      },
      {
        test: /\.jpg$/,
        loader: 'file',
      },
      {
        test: /\.woff$|.woff2$/,
        loader: 'url-loader?limit=10000&mimetype=application/font-woff',
      },
      {
        test: /\.ttf$/,
        loader: 'file-loader',
      },
      {
        test: /\.eot$/,
        loader: 'file-loader',
      },
    ],
  },
  postcss: [
    autoprefixer({ browsers: ['last 2 version', 'ie 9'] }),
  ],
  resolve: {
    alias: {
      app: path.resolve(__dirname, '../app'),
      tests: path.resolve(__dirname, '../tests'),
    },
    extensions: ['', '.js', '.json'],
    modulesDirectories: ['node_modules', 'app'],
  },
};
