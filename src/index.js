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

const isIEBrowser = browserName === 'IE';

firebase.initializeApp({
  apiKey: 'AIzaSyAj5mRl1zFY2p5m0veJVMIpGkPRQ1F_PYs',
  authDomain: 'notifikaattori-4a5c5.firebaseapp.com',
  databaseURL: 'https://notifikaattori-4a5c5.firebaseio.com',
  projectId: 'notifikaattori-4a5c5',
  storageBucket: 'notifikaattori-4a5c5.appspot.com',
  messagingSenderId: '21999149632',
  appId: '1:21999149632:web:c2bdd5e2bb318fba8575a5',
  measurementId: 'G-DY9ESEC2QF'
});

// TODO: Support IE11 in the future.
render(
  isIEBrowser ? <BrowserWarning />
    : (
      <Provider store={store}>
        <Router>{getRoutes()}</Router>
      </Provider>
    ),
  document.getElementById('root')
);
