import 'location-origin';
import 'moment/locale/fi';

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { browserHistory, Router } from 'react-router';
import { createStore } from 'redux';
import Immutable from 'seamless-immutable';

import getRoutes from 'app/routes';
import configureStore from 'state/configureStore';
import rootReducer from 'state/reducers';

import 'assets/styles/app.less';
import 'assets/styles/customization/espoo/customization.less';

const initialStoreState = createStore(rootReducer, {}).getState();
const initialState = window.INITIAL_STATE;
const finalState = Immutable(initialStoreState).merge(initialState, { deep: true });
const store = configureStore(finalState);

render(
  <Provider store={store}>
    <Router history={browserHistory}>
      {getRoutes(store)}
    </Router>
  </Provider>,
  document.getElementById('root')
);
