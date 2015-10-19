import createHistory from 'history/lib/createHashHistory';
import _ from 'lodash';
import { compose, createStore, applyMiddleware } from 'redux';
import { apiMiddleware } from 'redux-api-middleware';
import { reduxReactRouter } from 'redux-router';
import reduxLocalStoragePersistState, { mergePersistedState } from 'redux-localstorage';
import adapter from 'redux-localstorage/lib/adapters/localStorage';
import filter from 'redux-localstorage-filter';
import Immutable from 'seamless-immutable';

import getRoutes from 'app/routes';
import rootReducer from 'reducers/index';

let finalCreateStore;

const finalReducer = compose(
  mergePersistedState((initialState, persistedState) => {
    return Immutable(_.merge({}, initialState, persistedState));
  })
)(rootReducer);

const storage = compose(
  filter('auth')
)(adapter(window.localStorage));

if (__DEVTOOLS__) {
  const { devTools, persistState } = require('redux-devtools');
  const createLogger = require('redux-logger');
  const loggerMiddleware = createLogger();

  finalCreateStore = compose(
    applyMiddleware(apiMiddleware),
    reduxReactRouter({ getRoutes, createHistory }),
    applyMiddleware(loggerMiddleware),
    reduxLocalStoragePersistState(storage),
    devTools(),
    persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
  )(createStore);
} else {
  finalCreateStore = compose(
    applyMiddleware(apiMiddleware),
    reduxReactRouter({ getRoutes, createHistory }),
    reduxLocalStoragePersistState(storage)
  )(createStore);
}

export default function configureStore(initialState) {
  const store = finalCreateStore(finalReducer, initialState);

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('reducers', () => {
      const nextRootReducer = require('reducers/index');
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}
