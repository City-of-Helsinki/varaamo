const path = require('path');

require('dotenv').load({ path: path.resolve(__dirname, '../.env') });

const webpack = require('webpack');
const merge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const autoprefixer = require('autoprefixer');

const common = require('./webpack.common');

module.exports = merge(common, {
  entry: ['@babel/polyfill', path.resolve(__dirname, '../app/index.js')],
  devtool: 'source-map',
  mode: 'production',
  output: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/_assets/',
    filename: 'app.js',
  },
  module: {
    rules: [
      {
        test: /^(?!.*\.spec\.js$).*\.js$/,
        include: path.resolve(__dirname, '../app'),
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env', '@babel/preset-react'],
        },
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader?url=false',
          'resolve-url-loader',
          { loader: 'postcss-loader', options: { plugins: [autoprefixer({ browsers: ['last 2 version', 'ie 9'] })] } },
        ],
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader?url=false',
          { loader: 'postcss-loader', options: { plugins: [autoprefixer({ browsers: ['last 2 version', 'ie 9'] })] } },
          'resolve-url-loader',
          'sass-loader',
        ],
      },
    ],
  },
  plugins: [
    // Important to keep React file size down
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
      SETTINGS: {
        API_URL: JSON.stringify(process.env.API_URL || 'https://api.hel.fi/respa/v1'),
        SHOW_TEST_SITE_MESSAGE: Boolean(process.env.SHOW_TEST_SITE_MESSAGE),
        TRACKING: Boolean(process.env.PIWIK_SITE_ID),
      },
    }),
    new MiniCssExtractPlugin({
      filename: 'app.css',
    }),
  ],
  optimization: {
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true,
        sourceMap: true, // Must be set to true if using source-maps in production
      }),
    ],
  },
});
