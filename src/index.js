import 'react-app-polyfill/ie11';
import { browserName } from 'react-device-detect';
import 'location-origin';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-intl-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import firebase from 'firebase';

import '../app/assets/styles/main.scss';
import '../app/assets/styles/customization/espoo/customization.scss';
import '../app/assets/styles/customization/vantaa/customization.scss';

import store from './store';
import getRoutes from './routes';
import BrowserWarning from '../app/pages/browser-warning/BrowserWarning';
import settings from '../config/settings';

const isIEBrowser = browserName === 'IE';

/* eslint-disable no-undef */
// Initialize firebase project from .env variables
if (settings.FIREBASE.API_KEY && settings.FIREBASE.API_KEY.length > 0) {
  firebase.initializeApp({
    apiKey: settings.FIREBASE.API_KEY,
    authDomain: settings.FIREBASE.AUTH_DOMAIN,
    databaseURL: settings.FIREBASE.DATABASE_URL,
    projectId: settings.FIREBASE.PROJECT_ID,
    storageBucket: settings.FIREBASE.STORAGE_BUCKET,
    messagingSenderId: settings.FIREBASE.MESSAGING_SENDER_ID,
    appId: settings.FIREBASE.APP_ID,
    measurementId: settings.FIREBASE.MEASUREMENT_ID,
  });
}

// TODO: Support IE11 in the future.
render(
  isIEBrowser ? <BrowserWarning />
    : (
      <Provider store={store}>
        <Router>{getRoutes()}</Router>
      </Provider>
    ),
  document.getElementById('root'),
);
