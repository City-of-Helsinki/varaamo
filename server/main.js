/* eslint-disable func-names, no-console, no-var */

import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cookieSession from 'cookie-session';
import express from 'express';
import morgan from 'morgan';

import webpack from 'webpack';
import webpackMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import serverConfig from './config';
import configurePassport from './configurePassport';
import render from './render';
import webpackConfig from '../config/webpack.development';

const app = express();
const compiler = webpack(webpackConfig);
const passport = configurePassport();
const port = serverConfig.port;

if (serverConfig.isProduction) {
  console.log('Starting production server...');

  // Serve the static assets. We can cache them as they include hashes.
  app.use('/_assets', express.static('dist', { maxAge: '200d' }));
} else {
  console.log('Starting development server...');

  app.use(webpackMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
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
}

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(morgan('combined'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
  secret: process.env.SESSION_SECRET,
  maxAge: 60 * 60000,
}));

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

app.get('/login', passport.authenticate('helsinki'));

app.get(
  '/login/helsinki/return',
  passport.authenticate('helsinki', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/');
  });

app.get('/logout', function(req, res) {
  req.logOut();
  const redirectUrl = (
    serverConfig.isProduction ? 'https://varaamo.hel.fi' : `http://localhost:${port}`
  );
  res.redirect(`https://api.hel.fi/sso/logout/?next=${redirectUrl}`);
});

app.get('*', render);

app.listen(port, (error) => {
  if (error) {
    console.error(error);
  } else {
    if (serverConfig.isProduction) {
      console.log('Production server running on port ' + port);
    } else {
      console.log(`Listening at http://localhost:${port}`);
    }
  }
});
