/* eslint-disable func-names, no-console, no-var */

import express from 'express';
import passport from 'passport';
import { Strategy } from 'passport-helsinki';
import cookieSession from 'cookie-session';

import webpack from 'webpack';
import webpackMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import serverConfig from './config';
import render from './render';
import webpackConfig from '../config/webpack.development';

const app = express();
const compiler = webpack(webpackConfig);
const port = serverConfig.port;

if (serverConfig.isProduction) {
  console.log('Starting production server for reals...');
} else {
  console.log('Starting development server...');
}

// Passport configuration
// ######################
let helsinkiStrategy;
helsinkiStrategy = new Strategy(
  {
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: `http://localhost:${port}/login/helsinki/return`,
  },
  (accessToken, refreshToken, profile, cb) => {
    helsinkiStrategy.getAPIToken(accessToken, process.env.TARGET_APP, (token) => {
      profile.token = token;
      return cb(null, profile);
    });
  });

passport.use(helsinkiStrategy);

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((obj, cb) => {
  cb(null, obj);
});

if (!serverConfig.isProduction) {
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
} else {
  // Serve the static assets. We can cache them as they include hashes.
  app.use('/_assets', express.static('dist', { maxAge: '200d' }));
}

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(cookieSession({
  secret: process.env.SESSION_SECRET,
  cookie: { maxAge: 60 * 60000 },
}));

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

app.get('/', render);

app.get('/login', passport.authenticate('helsinki'));

app.get(
  '/login/helsinki/return',
  passport.authenticate('helsinki', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/');
  });

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
