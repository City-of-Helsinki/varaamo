import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cookieSession from 'cookie-session';
import express from 'express';
import nocache from 'nocache';

import configurePassport from './configurePassport';
import getAuthState from './getAuthState';

const router = express.Router();  // eslint-disable-line new-cap
const passport = configurePassport();
const maxSessionAge = 4 * 60 * 60 * 1000;  // 4 hours

// Session handling
router.use(cookieParser());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(cookieSession({
  secret: process.env.SESSION_SECRET,
  maxAge: maxSessionAge,
}));

// Initialize Passport and restore authentication state, if any, from the
// session.
router.use(passport.initialize());
router.use(passport.session());

router.get('/auth', nocache(), (req, res) => {
  res.json(getAuthState(req));
});

router.get('/login', passport.authenticate('helsinki'));

router.get('/login/helsinki/return',
  passport.authenticate(
    'helsinki',
    { failureRedirect: '/login' }
  ),
  (req, res) => {
    const js = '(function() {if(window.opener) { window.close(); } else { location.href = "/"; } }());';
    res.send(`<html><body>Login successful<script>${js}</script>`);
  }
);

router.get('/logout', (req, res) => {
  req.logOut();
  const redirectUrl = req.query.next || 'https://varaamo.hel.fi';
  res.redirect(`https://api.hel.fi/sso/logout/?next=${redirectUrl}`);
});

export default router;
