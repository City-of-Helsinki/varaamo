import { createStore, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import { composeWithDevTools } from 'redux-devtools-extension/logOnlyInProduction';

import rootReducer from 'state/rootReducer';
import middleware from './middleware';
import persistConfig from './middleware/persistConfig';


function configureStore(initialState) {
  const persistedReducer = persistReducer(persistConfig, rootReducer);
  const store = createStore(
    persistedReducer, initialState, composeWithDevTools(applyMiddleware(...middleware)),
  );
  const persistor = persistStore(store);
  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('state/rootReducer', () => {
      const nextRootReducer = require('state/rootReducer'); // eslint-disable-line global-require

      store.replaceReducer(nextRootReducer);
    });
  }

  return { store, persistor };
}

export default configureStore;
