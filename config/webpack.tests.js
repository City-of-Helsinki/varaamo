const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const merge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const common = require('./webpack.common');

module.exports = merge(common, {
  mode: 'development',
  externals: {
    cheerio: 'window',
    'react/addons': true,
    'react/lib/ExecutionEnvironment': true,
    'react/lib/ReactContext': true,
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, '../app'),
          path.resolve(__dirname, './'),
        ],
        loader: 'babel-loader',
        options: {
          plugins: [
            ['istanbul', {
              exclude: [
                '**/*.spec.js',
                '**/specs.bootstrap.js',
              ],
            }],
          ],
          presets: ['@babel/preset-env', '@babel/preset-react'],
        },
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
        ],
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'resolve-url-loader',
          'postcss-loader',
          'sass-loader',
        ],
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
    new MiniCssExtractPlugin({
      filename: 'app.css',
    }),
  ],
});
