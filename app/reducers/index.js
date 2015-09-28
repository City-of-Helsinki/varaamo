import {combineReducers} from 'redux';
import {routerStateReducer as router} from 'redux-react-router';

import {searchReducer} from 'reducers/search';
import {resourcesReducer} from 'reducers/resources';

export default combineReducers({
  resources: resourcesReducer,
  router,
  search: searchReducer,
});
