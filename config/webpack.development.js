const path = require('path');

const webpack = require('webpack');
const merge = require('webpack-merge');
const autoprefixer = require('autoprefixer');

const common = require('./webpack.common');
const getCssLoaders = require('./getCssLoaders');

module.exports = merge(common, {
  mode: 'development',
  entry: [
    '@babel/polyfill',
    'webpack-hot-middleware/client',
    path.resolve(__dirname, '../src/index.js'),
  ],
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'app.js',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.(js|jsx)$/,
        include: [path.resolve(__dirname, '../app'), path.resolve(__dirname, '../src')],
        loader: 'eslint-loader',
        options: {
          configFile: path.resolve(__dirname, '../.eslintrc'),
          eslintPath: require.resolve('eslint'),
          emitWarning: true,
        },
      },
      {
        test: /\.(js|jsx)$/,
        include: [path.resolve(__dirname, '../app'), path.resolve(__dirname, '../src')],
        exclude: path.resolve(__dirname, '../node_modules'),
        options: {
          presets: ['@babel/preset-env', '@babel/preset-react'],
        },
        loader: 'babel-loader',
      },
      ...getCssLoaders(),
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'resolve-url-loader',
          { loader: 'sass-loader', options: { sourceMap: true, sourceMapContents: false } },
          { loader: 'postcss-loader', options: { plugins: [autoprefixer({ browsers: ['last 2 version', 'ie 9'] })] } },
        ],
      },
    ],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
  ],
});
