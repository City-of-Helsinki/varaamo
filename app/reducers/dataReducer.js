import Immutable from 'seamless-immutable';

import ActionTypes from 'constants/ActionTypes';

const initialState = Immutable({
  resources: {},
  units: {},
});

export function dataReducer(state = initialState, action) {
  switch (action.type) {

  case ActionTypes.FETCH_RESOURCE_SUCCESS:
  case ActionTypes.FETCH_RESOURCES_SUCCESS:
  case ActionTypes.FETCH_UNITS_SUCCESS:
    const data = action.payload.entities;
    return state.merge(data, { deep: true });

  default:
    return state;
  }
}
