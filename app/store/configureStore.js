import { createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/logOnlyInProduction';

import rootReducer from '../state/rootReducer';
import middleware from './middleware';

const finalCreateStore = composeWithDevTools(...middleware)(createStore);

function configureStore(initialState) {
  const store = finalCreateStore(rootReducer, initialState);

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('state/rootReducer', () => {
      const nextRootReducer = require('state/rootReducer'); // eslint-disable-line global-require

      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}

export default configureStore;
