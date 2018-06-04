import passport from 'passport';
import { Strategy } from 'passport-helsinki';

function configurePassport() {
  const helsinkiStrategy = new Strategy(
    {
      authorizationURL: 'https://tunnistamo-demo.metatavu.io/oauth2/authorize/',
      tokenURL: 'https://tunnistamo-demo.metatavu.io/oauth2/token/',
      userProfileURL: 'https://tunnistamo-demo.metatavu.io/user/',
      appTokenURL: 'https://tunnistamo-demo.metatavu.io/jwt-token/',
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: process.env.LOGIN_CALLBACK_URL || '/login/helsinki/return',
      proxy: Boolean(process.env.PROXY),
    },
    (accessToken, refreshToken, profile, cb) => {
      helsinkiStrategy.getAPIToken(accessToken, process.env.TARGET_APP, (token) => {
        const profileWithToken = Object.assign({}, profile, { token });
        return cb(null, profileWithToken);
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
