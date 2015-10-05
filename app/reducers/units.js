import _ from 'lodash';
import Immutable from 'seamless-immutable';

import ActionTypes from 'constants/ActionTypes';

export function unitsReducer(state = Immutable({}), action) {
  let units;

  switch (action.type) {

  case ActionTypes.FETCH_RESOURCE_SUCCESS:
    units = action.payload.entities.units;
    return state.merge(units);

  case ActionTypes.FETCH_UNITS_SUCCESS:
    units = action.payload.entities.units;
    return state.merge(_.indexBy(units, 'id'));

  default:
    return state;
  }
}
