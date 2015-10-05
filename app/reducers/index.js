import { combineReducers } from 'redux';
import { routerStateReducer as router } from 'redux-react-router';

import { apiReducer } from 'reducers/apiReducer';
import { dataReducer } from 'reducers/dataReducer';
import { uiReducer } from 'reducers/uiReducer';

export default combineReducers({
  api: apiReducer,
  data: dataReducer,
  router,
  ui: uiReducer,
});
