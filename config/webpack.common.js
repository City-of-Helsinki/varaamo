const webpack = require('webpack');

module.exports = {
  module: {
    rules: [
      {
        test: /\.png$/,
        loader: 'url-loader',
        options: {
          mimetype: 'image/png',
        },
      },
      {
        test: /\.gif$/,
        loader: 'url-loader',
        options: {
          mimetype: 'image/gif',
        },
      },
      {
        test: /\.ico$/,
        loader: 'url-loader',
        options: {
          mimetype: 'image/x-icon',
        },
      },
      {
        test: /\.jpg$/,
        use: [
          {
            loader: 'url-loader',
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
    extensions: ['.js', '.json'],
    modules: ['node_modules', 'app'],
  },
  plugins: [
    new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /en-gb|fi|sv/),
  ],
};
