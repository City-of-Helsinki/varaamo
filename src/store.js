import { createStore } from 'redux';
import Immutable from 'seamless-immutable';

import initI18n from '../app/i18n/initI18n';
import configureStore from '../app/store/configureStore';
import rootReducer from '../app/state/rootReducer';

const initialStoreState = createStore(rootReducer, {}).getState();
const initialServerState = window.INITIAL_STATE;
const initialIntlState = initI18n();
const finalState = Immutable(initialStoreState).merge(
  [initialServerState, initialIntlState],
  {
    deep: true,
  }
);
const store = configureStore(finalState);

export default store;
