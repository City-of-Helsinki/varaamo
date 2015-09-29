import { Map } from 'immutable';

import ActionTypes from 'constants/ActionTypes';

export function unitsReducer(state = Map(), action) {
  switch (action.type) {

  case ActionTypes.FETCH_RESOURCE_SUCCESS:
    const { units } = action.payload.entities;
    return state.merge(units);

  default:
    return state;
  }
}
