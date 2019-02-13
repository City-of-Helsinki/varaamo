const webpack = require('webpack');

module.exports = {
  module: {
    rules: [
      {
        test: /\.json$/,
        loader: 'json',
      },
      {
        test: /\.png$/,
        loader: 'url?limit=100000&mimetype=image/png',
      },
      {
        test: /\.gif$/,
        loader: 'url?limit=100000&mimetype=image/gif',
      },
      {
        test: /\.ico$/,
        loader: 'url?limit=100000&mimetype=image/x-icon',
      },
      {
        test: /\.jpg$/,
        loader: 'file?name=[name].[ext]',
      },
      {
        test: /\.woff|\.woff2|\.svg|.eot|\.ttf/,
        loader: 'url?prefix=font/&limit=10000',
      },
    ],
  },
  resolve: {
    modules: ['node_modules', 'app'],
  },
  plugins: [
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en-gb|fi|sv/),
  ],
};
