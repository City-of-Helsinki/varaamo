import _ from 'lodash';
import Immutable from 'seamless-immutable';

import ActionTypes from 'constants/ActionTypes';

export function resourcesReducer(state = Immutable({}), action) {
  let resources;

  switch (action.type) {

  case ActionTypes.FETCH_RESOURCE_SUCCESS:
    resources = action.payload.entities.resources;
    return state.merge(resources);

  case ActionTypes.FETCH_RESOURCES_SUCCESS:
    resources = action.payload.entities.resources;
    return state.merge(_.indexBy(resources, 'id'));

  default:
    return state;
  }
}
