import { combineReducers } from 'redux';
import { routerStateReducer } from 'redux-router';

import { apiReducer } from 'reducers/apiReducer';
import { dataReducer } from 'reducers/dataReducer';
import { uiReducer } from 'reducers/uiReducer';

export default combineReducers({
  api: apiReducer,
  data: dataReducer,
  router: routerStateReducer,
  ui: uiReducer,
});
