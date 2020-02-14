const webpack = require('webpack');

module.exports = {
  node: {
    // The settings file is shared between the client and the server. In that
    // file we make use of dotenv and fs. Reading settings in the client will
    // therefore result in an error unless we mock fs.
    fs: 'empty',
  },
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
    extensions: ['.js', '.json'],
    modules: ['node_modules'],
  },
  plugins: [
    new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /en-gb|fi|sv/),
  ],
};
