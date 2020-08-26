const path = require('path');

const dotenv = require('dotenv');

const DEFAULT_API_URL = 'https://api.hel.fi/respa-test/v1';
const DEFAULT_TIME_ZONE = 'Europe/Helsinki';
const DEFAULT_LOGIN_CALLBACK_URL = '/login/helsinki/return';
const ENV_NAMESPACE = 'VARAAMO_ENV';

function getAsArray(value) {
  if (value === undefined || value === null) {
    return undefined;
  }

  try {
    const asArray = JSON.parse(value);

    if (Array.isArray(asArray)) {
      return asArray;
    }

    return undefined;
  } catch (e) {
    return undefined;
  }
}

function getSettings() {
  if (
    typeof window !== 'undefined'
    && typeof window[ENV_NAMESPACE] !== 'undefined'
  ) {
    // Needed in browser run context
    return window[ENV_NAMESPACE];
  }

  // This enables reading the environment variables from a .env file,
  // useful in a local development context.
  dotenv.config({ path: path.resolve(__dirname, '../.env') });
  // process.env is needed in server run context and with jest tests
  return {
    PORT: process.env.PORT,
    NODE_ENV: process.env.NODE_ENV,
    PIWIK_SITE_ID: process.env.PIWIK_SITE_ID,
    API_URL: process.env.API_URL || DEFAULT_API_URL,
    ACCESSIBILITY_API_URL: process.env.ACCESSIBILITY_API_URL,
    ACCESSIBILITY_API_SYSTEM_ID: process.env.ACCESSIBILITY_API_SYSTEM_ID,
    SHOW_TEST_SITE_MESSAGE: Boolean(process.env.SHOW_TEST_SITE_MESSAGE),
    TRACKING: Boolean(process.env.PIWIK_SITE_ID),
    // The state does not accept array values, so arrays should get casted into
    // strings. If we want to use them as arrays, we have to parse the string
    // into an array value.
    CUSTOM_MUNICIPALITY_OPTIONS: getAsArray(
      process.env.CUSTOM_MUNICIPALITY_OPTIONS,
    ),
    TIME_ZONE: process.env.TIME_ZONE || DEFAULT_TIME_ZONE,
    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
    PROXY: process.env.PROXY,
    LOGIN_CALLBACK_URL:
      process.env.LOGIN_CALLBACK_URL || DEFAULT_LOGIN_CALLBACK_URL,
    TARGET_APP: process.env.TARGET_APP,
    FIREBASE: {
      API_KEY: process.env.FIREBASE_API_KEY,
      AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
      DATABASE_URL: process.env.FIREBASE_DATABASE_URL,
      PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
      STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
      MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID,
      APP_ID: process.env.FIREBASE_APP_ID,
      MEASUREMENT_ID: process.env.FIREBASE_MEASUREMENT_ID,
    },
  };
}

const settings = getSettings();

module.exports = settings;
module.exports.ENV_NAMESPACE = ENV_NAMESPACE;
