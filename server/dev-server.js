/* eslint-disable no-console */

import express from 'express';
import webpack from 'webpack';
import webpackMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import config from '../config/webpack.development';
import routes from './routes';

const app = express();
const compiler = webpack(config);
const port = 3000;

console.log('Starting development server...');

app.use(webpackMiddleware(compiler, {
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
}));

app.use(webpackHotMiddleware(compiler));

app.use(routes);

app.listen(port, (error) => {
  if (error) {
    console.error(error);
  } else {
    console.log(`Listening at http://localhost:${port}`);
  }
});
