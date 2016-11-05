import 'location-origin';
import 'moment/locale/fi';

import React from 'react';
import { render } from 'react-dom';
import { addLocaleData } from 'react-intl';
import en from 'react-intl/locale-data/en';
import fi from 'react-intl/locale-data/fi';
import se from 'react-intl/locale-data/se';
import { Provider } from 'react-intl-redux';
import { browserHistory, Router } from 'react-router';
import { createStore } from 'redux';
import Immutable from 'seamless-immutable';

import 'assets/styles/app.less';
import 'assets/styles/customization/espoo/customization.less';
import getRoutes from 'app/routes';
import configureStore from 'state/configureStore';
import rootReducer from 'state/reducers';
import fiMessages from 'translations/fi.json';

addLocaleData([...en, ...fi, ...se]);
const initialStoreState = createStore(rootReducer, {}).getState();
const initialServerState = window.INITIAL_STATE;
const initialIntlState = {
  intl: {
    defaultLocale: 'fi',
    locale: 'fi',
    messages: fiMessages,
  },
};
const finalState = Immutable(initialStoreState).merge(
  [initialServerState, initialIntlState], { deep: true }
);
const store = configureStore(finalState);

render(
  <Provider store={store}>
    <Router history={browserHistory}>
      {getRoutes(store)}
    </Router>
  </Provider>,
  document.getElementById('root')
);
