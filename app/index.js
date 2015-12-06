import 'babel-core/polyfill';
import 'location-origin';

import createHistory from 'history/lib/createBrowserHistory';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import { createStore } from 'redux';
import { syncReduxAndRouter } from 'redux-simple-router';
import Immutable from 'seamless-immutable';

import getRoutes from 'app/routes';
import rootReducer from 'reducers/index';
import configureStore from 'store/configureStore';

import 'assets/styles/app.less';

const initialStoreState = createStore(rootReducer, {}).getState();
const initialState = window.__INITIAL_STATE__;
const finalState = Immutable(initialStoreState).merge(initialState, { deep: true });
const store = configureStore(finalState);
const history = createHistory();

syncReduxAndRouter(history, store);

render(
  <Provider store={store}>
    <Router history={history}>
      {getRoutes(store)}
    </Router>
  </Provider>,
  document.getElementById('root')
);

if (__DEVTOOLS__) {
  require('./createDevToolsWindow')(store);
}
