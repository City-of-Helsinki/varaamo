import passport from 'passport';
import { Strategy } from 'passport-helsinki';

import serverConfig from './config';

function configurePassport() {
  let helsinkiStrategy;
  const callbackURL = (
    serverConfig.isProduction ?
    'http://respa.hel.ninja/login/helsinki/return' :
    `http://localhost:${serverConfig.port}/login/helsinki/return`
  );
  helsinkiStrategy = new Strategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL,
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

  return passport;
}

export default configurePassport;
