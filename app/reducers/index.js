import { combineReducers } from 'redux';
import { routerStateReducer } from 'redux-router';

import apiReducer from 'reducers/apiReducer';
import authReducer from 'reducers/authReducer';
import dataReducer from 'reducers/dataReducer';
import modalsReducer from 'reducers/modalsReducer';
import reservationReducer from 'reducers/reservationReducer';
import searchReducer from 'reducers/searchReducer';

const rootReducer = combineReducers({
  api: apiReducer,
  auth: authReducer,
  data: dataReducer,
  router: routerStateReducer,
  ui: combineReducers({
    modals: modalsReducer,
    reservation: reservationReducer,
    search: searchReducer,
  }),
});

export default rootReducer;
