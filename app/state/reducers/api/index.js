import { combineReducers } from 'redux';

import activeRequestsReducer from './activeRequestsReducer';
import fetchCountsReducer from './fetchCountsReducer';
import shouldFetchReducer from './shouldFetchReducer';

const apiReducers = combineReducers({
  activeRequests: activeRequestsReducer,
  fetchCounts: fetchCountsReducer,
  shouldFetch: shouldFetchReducer,
});

export default apiReducers;
