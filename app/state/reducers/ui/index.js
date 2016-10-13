import { combineReducers } from 'redux';

import adminResourcesPageReducer from './adminResourcesPageReducer';
import modalsReducer from './modalsReducer';
import reservationsReducer from './reservationsReducer';
import searchReducer from './searchReducer';

const uiReducers = combineReducers({
  modals: modalsReducer,
  pages: combineReducers({ adminResources: adminResourcesPageReducer }),
  reservations: reservationsReducer,
  search: searchReducer,
});

export default uiReducers;
