import _ from 'lodash';
import {Map} from 'immutable';

import ActionTypes from 'constants/ActionTypes';

export function resources(state = Map(), action) {
  switch (action.type) {

  case ActionTypes.FETCH_RESOURCE_SUCCESS:
    const {resource} = action.payload;
    return state.merge({[resource.id]: resource});

  case ActionTypes.FETCH_RESOURCES_SUCCESS:
    return state.merge(_.indexBy(action.payload.resources, 'id'));

  default:
    return state;
  }
}
