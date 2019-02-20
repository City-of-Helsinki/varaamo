const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const merge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const autoprefixer = require('autoprefixer');

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
        include: path.resolve(__dirname, '../app'),
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
          { loader: 'css-loader', options: { url: false } },
          { loader: 'postcss-loader', options: { plugins: [autoprefixer({ browsers: ['last 2 version', 'ie 9'] })] } },
        ],
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          { loader: 'css-loader', options: { url: false } },
          'resolve-url-loader',
          { loader: 'sass-loader', options: { sourceMap: true, sourceMapContents: false } },
          { loader: 'postcss-loader', options: { plugins: [autoprefixer({ browsers: ['last 2 version', 'ie 9'] })] } },
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
    new MiniCssExtractPlugin({
      filename: 'app.css',
    }),
  ],
});
