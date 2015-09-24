/* eslint-disable no-var, prefer-arrow-callback, prefer-template */

var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./conf/webpack.development');

var compiler = webpack(config);
var bundler;
var bundleStart = null;
var port = 3030;

console.log('Starting development server...');

compiler.plugin('compile', function() {
  console.log('Bundling...');
  bundleStart = Date.now();
});

compiler.plugin('done', function() {
  console.log('Bundled in ' + (Date.now() - bundleStart) + 'ms!');
});

bundler = new WebpackDevServer(compiler, {
  historyApiFallback: true,
  hot: true,
  inline: true,
  publicPath: config.output.publicPath,
  quiet: false,
  noInfo: false,
  stats: {
    assets: false,
    chunkModules: false,
    chunks: true,
    colors: true,
    hash: false,
    progress: false,
    timings: false,
    version: false,
  },
});

bundler.listen(port, 'localhost', function() {
  console.log('Bundling project, please wait...');
});
