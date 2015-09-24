import {combineReducers} from 'redux';
import {routerStateReducer as router} from 'redux-react-router';

import {search} from 'reducers/search';
import {resources} from 'reducers/resources';

export default combineReducers({
  resources,
  router,
  search,
});
