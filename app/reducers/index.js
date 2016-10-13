import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import authReducer from 'reducers/authReducer';
import dataReducer from 'reducers/dataReducer';
import notificationsReducer from 'reducers/notificationsReducer';
import apiReducers from './api';
import uiReducers from './ui';

const rootReducer = combineReducers({
  api: apiReducers,
  auth: authReducer,
  data: dataReducer,
  form: formReducer,
  notifications: notificationsReducer,
  ui: uiReducers,
});

export default rootReducer;
