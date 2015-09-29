import _ from 'lodash';
import { Map } from 'immutable';

import ActionTypes from 'constants/ActionTypes';

export function resourcesReducer(state = Map(), action) {
  let resources;

  switch (action.type) {

  case ActionTypes.FETCH_RESOURCE_SUCCESS:
    resources = action.payload.entities.resources;
    return state.merge(resources);

  case ActionTypes.FETCH_RESOURCES_SUCCESS:
    resources = _.values(action.payload);
    return state.merge(_.indexBy(resources, 'id'));

  default:
    return state;
  }
}
