import passport from 'passport';
import { Strategy as HelsinkiStrategy } from 'passport-helsinki';
import KeycloakStrategy from "@exlinc/keycloak-passport";

function configureHelsinkiStrategy() {
  return new HelsinkiStrategy({
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: process.env.LOGIN_CALLBACK_URL || '/login/helsinki/return',
      proxy: Boolean(process.env.PROXY),
    }, (accessToken, refreshToken, profile, cb) => {
      helsinkiStrategy.getAPIToken(accessToken, process.env.TARGET_APP, (token) => {
        const profileWithToken = Object.assign({}, profile, { token });
        return cb(null, profileWithToken);
      });
  });
}

function configureKeycloakStrategy() {
  const realm = process.env.KEYCLOAK_REALM;
  const url = process.env.KEYCLOAK_URL;

  return new KeycloakStrategy({
      host: url,
      realm: realm,
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: process.env.LOGIN_CALLBACK_URL || '/login/keycloak/return',
      authorizationURL: `${url}/auth/realms/${realm}/protocol/openid-connect/auth`,
      tokenURL: `${url}/auth/realms/${realm}/protocol/openid-connect/token`,
      userInfoURL: `${url}/auth/realms/${realm}/protocol/openid-connect/userinfo`,
    }, (accessToken, refreshToken, profileData, done) => {
      const profile = {
        id: profileData.keycloakId,
        displayName: profileData.fullName,
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        username: profileData.username,
        emails: [{
          value: profileData.email
        }],
        provider: process.env.AUTH_PROVIDER,
        token: accessToken
      };

      done(null, profile)
    }
  );
}

function configurePassport() {
  const authProvider = process.env.AUTH_PROVIDER || 'helsinki';
  let strategy = null;

  switch (authProvider) {
    case 'helsinki':
      strategy = configureHelsinkiStrategy();
    break;
    case 'keycloak':
      strategy = configureKeycloakStrategy();
    break;
    default:
      return null;
  }
  
  passport.use(authProvider, strategy);

  passport.serializeUser((user, cb) => {
    cb(null, user);
  });

  passport.deserializeUser((obj, cb) => {
    cb(null, obj);
  });

  return passport;
}

export default configurePassport;
