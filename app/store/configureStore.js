import { compose, createStore, applyMiddleware } from 'redux';
import { apiMiddleware } from 'redux-api-middleware';

import rootReducer from 'reducers/index';

const isDevelopment = process.env.NODE_ENV !== 'production';
let finalCreateStore;
const storeEnhancers = [applyMiddleware(apiMiddleware)];

if (isDevelopment) {
  const createLogger = require('redux-logger');
  const loggerMiddleware = createLogger({
    collapsed: true,
    duration: true,
  });
  storeEnhancers.push(applyMiddleware(loggerMiddleware));
  if (__DEVTOOLS__) {
    const { devTools, persistState } = require('redux-devtools');
    storeEnhancers.push(devTools());
    storeEnhancers.push(persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/)));
  }
}

finalCreateStore = compose(...storeEnhancers)(createStore);

function configureStore(initialState) {
  const store = finalCreateStore(rootReducer, initialState);

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('reducers', () => {
      const nextRootReducer = require('reducers/index');
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}

export default configureStore;
