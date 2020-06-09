import { combineReducers } from 'redux';

import adminResourcesPageReducer from './adminResourcesPageReducer';
import modalsReducer from './modalsReducer';
import reservationInfoModalReducer from './reservationInfoModalReducer';
import reservationsReducer from './reservationsReducer';
import resourceMapReducer from './resourceMapReducer';
import accessibilityReducer from './accessibilityReducer';

const uiReducers = combineReducers({
  modals: modalsReducer,
  pages: combineReducers({ adminResources: adminResourcesPageReducer }),
  reservationInfoModal: reservationInfoModalReducer,
  reservations: reservationsReducer,
  resourceMap: resourceMapReducer,
  accessibility: accessibilityReducer,
});

export default uiReducers;
