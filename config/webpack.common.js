const path = require('path');

const webpack = require('webpack');

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

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
    new webpack.DefinePlugin({
      FIREBASE: {
        API_KEY: JSON.stringify(process.env.FIREBASE_API_KEY),
        AUTH_DOMAIN: JSON.stringify(process.env.FIREBASE_AUTH_DOMAIN),
        DATABASE_URL: JSON.stringify(process.env.FIREBASE_DATABASE_URL),
        PROJECT_ID: JSON.stringify(process.env.FIREBASE_PROJECT_ID),
        STORAGE_BUCKET: JSON.stringify(process.env.FIREBASE_STORAGE_BUCKET),
        MESSAGING_SENDER_ID: JSON.stringify(process.env.FIREBASE_MESSAGING_SENDER_ID),
        APP_ID: JSON.stringify(process.env.FIREBASE_APP_ID),
        MEASUREMENT_ID: JSON.stringify(process.env.FIREBASE_MEASUREMENT_ID)
      }
    }),
    new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /en-gb|fi|sv/),
  ],
};
