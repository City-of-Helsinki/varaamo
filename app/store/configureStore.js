import createHistory from 'history/lib/createBrowserHistory';
import { compose, createStore, applyMiddleware } from 'redux';
import { apiMiddleware } from 'redux-api-middleware';
import loggerMiddleware from 'redux-logger';
import { reduxReactRouter } from 'redux-react-router';

import routes from 'app/routes';
import rootReducer from 'reducers/index';

let finalCreateStore;

if (__DEVTOOLS__) {
  const { devTools, persistState } = require('redux-devtools');
  finalCreateStore = compose(
    applyMiddleware(apiMiddleware),
    reduxReactRouter({ routes, createHistory }),
    applyMiddleware(loggerMiddleware),
    devTools(),
    persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
  )(createStore);
} else {
  finalCreateStore = applyMiddleware(apiMiddleware)(createStore);
}

export default function configureStore(initialState) {
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
