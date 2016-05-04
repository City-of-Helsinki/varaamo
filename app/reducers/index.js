import { combineReducers } from 'redux';
import { routeReducer } from 'redux-simple-router';
import { reducer as formReducer } from 'redux-form';

import activeRequestsReducer from 'reducers/activeRequestsReducer';
import authReducer from 'reducers/authReducer';
import dataReducer from 'reducers/dataReducer';
import fetchCountsReducer from 'reducers/fetchCountsReducer';
import modalsReducer from 'reducers/modalsReducer';
import notificationsReducer from 'reducers/notificationsReducer';
import reservationsReducer from 'reducers/reservationsReducer';
import searchReducer from 'reducers/searchReducer';
import shouldFetchReducer from 'reducers/shouldFetchReducer';

const rootReducer = combineReducers({
  api: combineReducers({
    activeRequests: activeRequestsReducer,
    fetchCounts: fetchCountsReducer,
    shouldFetch: shouldFetchReducer,
  }),
  auth: authReducer,
  data: dataReducer,
  form: formReducer,
  notifications: notificationsReducer,
  routing: routeReducer,
  ui: combineReducers({
    modals: modalsReducer,
    reservations: reservationsReducer,
    search: searchReducer,
  }),
});

export default rootReducer;
