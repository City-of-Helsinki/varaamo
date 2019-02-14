const webpack = require('webpack');

module.exports = {
  module: {
    rules: [
      {
        test: /\.png$/,
        loader: 'url-loader?limit=100000&mimetype=image/png',
      },
      {
        test: /\.gif$/,
        loader: 'url-loader?limit=100000&mimetype=image/gif',
      },
      {
        test: /\.ico$/,
        loader: 'url-loader?limit=100000&mimetype=image/x-icon',
      },
      {
        test: /\.jpg$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
            },
          },
        ],
      },
      {
        test: /\.woff|\.woff2|\.svg|.eot|\.ttf/,
        loader: 'url-loader?prefix=font/&limit=10000',
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
