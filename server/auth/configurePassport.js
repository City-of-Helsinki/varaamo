import passport from 'passport';
import { Strategy } from 'passport-helsinki';

import settings from '../../config/settings';

function configurePassport() {
  const helsinkiStrategy = new Strategy(
    {
      clientID: settings.CLIENT_ID,
      clientSecret: settings.CLIENT_SECRET,
      callbackURL: settings.LOGIN_CALLBACK_URL,
      proxy: Boolean(settings.PROXY),
    },
    (accessToken, refreshToken, profile, cb) => {
      helsinkiStrategy.getAPIToken(
        accessToken,
        settings.TARGET_APP,
        (token) => {
          const profileWithToken = { ...profile, token };
          return cb(null, profileWithToken);
        }
      );
    }
  );

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
