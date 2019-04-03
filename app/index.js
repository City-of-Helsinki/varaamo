import 'react-app-polyfill/ie11';
import { browserName } from 'react-device-detect';
import 'location-origin';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-intl-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { createStore } from 'redux';
import Immutable from 'seamless-immutable';

import 'assets/styles/main.scss';
import 'assets/styles/customization/espoo/customization.scss';
import 'assets/styles/customization/vantaa/customization.scss';
import { initI18n } from 'i18n';
import configureStore from 'store/configureStore';
import rootReducer from 'state/rootReducer';
import getRoutes from './routes';

const initialStoreState = createStore(rootReducer, {}).getState();
const initialServerState = window.INITIAL_STATE;
const initialIntlState = initI18n();
const finalState = Immutable(initialStoreState).merge([initialServerState, initialIntlState], {
  deep: true,
});
const store = configureStore(finalState);
const warningStyle = {
  margin: '20px',
  padding: '20px',
  color: '#5d3d08',
  backgroundColor: '#fcf8e3',
  border: '2px solid #faebcc',
};

if (browserName === 'IE') {
  render(
    <div>
      <p style={warningStyle}>
        Currently, Varaamo does not support IE11.
        We are investigating this issue and finding a solution.
        Meanwhile, use another browser (such as
        <a href="https://www.google.com/chrome/" style={{ textDecoration: 'none' }}> Chrome</a>
        ,
        <a href="https://www.mozilla.org/en-US/firefox/new/" style={{ textDecoration: 'none' }}> Firefox </a>
        or
        <a href="https://www.microsoft.com/en-us/windows/microsoft-edge" style={{ textDecoration: 'none' }}> Edge</a>
        ).
      </p>
      <p style={warningStyle}>
        Varaamo ei tue IE11 selainta tällä hetkellä.
        Selvitämme ongelmaa sen ratkaisemiseksi.
        Sillävälin, käytä toista selainta (kuten
        <a href="https://www.google.com/chrome/" style={{ textDecoration: 'none' }}> Chrome</a>
        ,
        <a href="https://www.mozilla.org/en-US/firefox/new/" style={{ textDecoration: 'none' }}> Firefox </a>
        tai
        <a href="https://www.microsoft.com/en-us/windows/microsoft-edge" style={{ textDecoration: 'none' }}> Edge</a>
        ).
      </p>
    </div>,
    document.getElementById('root')
  );
} else {
  render(
    <Provider store={store}>
      <Router>{getRoutes()}</Router>
    </Provider>,
    document.getElementById('root')
  );
}
