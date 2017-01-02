import 'location-origin';

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-intl-redux';
import { browserHistory, Router } from 'react-router';
import { createStore } from 'redux';
import Immutable from 'seamless-immutable';

import 'assets/styles/app.less';
import 'assets/styles/customization/espoo/customization.less';
import { initI18n } from 'i18n';
import configureStore from 'state/configureStore';
import rootReducer from 'state/reducers';
import getRoutes from './routes';

const initialStoreState = createStore(rootReducer, {}).getState();
const initialServerState = window.INITIAL_STATE;
const initialIntlState = initI18n();
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
