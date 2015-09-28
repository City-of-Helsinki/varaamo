import _ from 'lodash';
import {Map} from 'immutable';

import ActionTypes from 'constants/ActionTypes';

export function resourcesReducer(state = Map(), action) {
  switch (action.type) {

  case ActionTypes.FETCH_RESOURCE_SUCCESS:
    const resource = action.payload;
    return state.merge({[resource.id]: resource});

  case ActionTypes.FETCH_RESOURCES_SUCCESS:
    const resources = _.values(action.payload);
    return state.merge(_.indexBy(resources, 'id'));

  default:
    return state;
  }
}
