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

if (browserName === 'IE') {
  render(
    <div>
      <p className="warningStyle">
        Currently, Varaamo does not support IE11.
        We are investigating this issue and finding a solution.
        Meanwhile, use another browser (such as
        <a href="https://www.google.com/chrome/"> Chrome</a>
        ,
        <a href="https://www.mozilla.org/en-US/firefox/new/"> Firefox </a>
        or
        <a href="https://www.microsoft.com/en-us/windows/microsoft-edge"> Edge</a>
        ).
      </p>
      <p className="warningStyle">
        Varaamo ei tue IE11 selainta tällä hetkellä.
        Selvitämme ongelmaa sen ratkaisemiseksi.
        Sillävälin, käytä toista selainta (kuten
        <a href="https://www.google.com/chrome/"> Chrome</a>
        ,
        <a href="https://www.mozilla.org/en-US/firefox/new/"> Firefox </a>
        tai
        <a href="https://www.microsoft.com/en-us/windows/microsoft-edge"> Edge</a>
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
