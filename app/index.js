import 'babel-core/polyfill';
import 'location-origin';

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { ReduxRouter } from 'redux-router';
import Immutable from 'seamless-immutable';

import rootReducer from 'reducers/index';
import configureStore from 'store/configureStore';

import 'assets/styles/app.less';

const initialStoreState = createStore(rootReducer, {}).getState();
const initialState = window.__INITIAL_STATE__;
const finalState = Immutable(initialStoreState).merge(initialState, { deep: true });
const store = configureStore(finalState);

render(
  <Provider store={store}>
    <ReduxRouter
      components={[]}
      location={{}}
      params={{}}
      routes={[]}
    />
  </Provider>,
  document.getElementById('root')
);

if (__DEVTOOLS__) {
  require('./createDevToolsWindow')(store);
}
