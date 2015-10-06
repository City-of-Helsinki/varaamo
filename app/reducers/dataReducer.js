import Immutable from 'seamless-immutable';

import ActionTypes from 'constants/ActionTypes';

export default {
  dataReducer,
  handleData,
};

const initialState = Immutable({
  resources: {},
  units: {},
});

function handleData(state, action) {
  const data = action.payload.entities;
  return state.merge(data, { deep: true });
}

function dataReducer(state = initialState, action) {
  switch (action.type) {

  case ActionTypes.FETCH_RESOURCE_SUCCESS:
  case ActionTypes.FETCH_RESOURCES_SUCCESS:
  case ActionTypes.FETCH_UNITS_SUCCESS:
    return handleData(state, action);

  default:
    return state;
  }
}
