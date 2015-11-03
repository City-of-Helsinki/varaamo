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
        test: /\.gif$/,
        loader: 'url?limit=100000&mimetype=image/gif',
      },
      {
        test: /\.jpg$/,
        loader: 'file',
      },
      {
        test: /\.woff|\.woff2|\.svg|.eot|\.ttf/,
        loader: 'url?prefix=font/&limit=10000',
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
