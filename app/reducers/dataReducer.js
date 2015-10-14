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

function handleData(state, data) {
  return state.merge(data, { deep: true });
}

function dataReducer(state = initialState, action) {
  switch (action.type) {

  case ActionTypes.FETCH_PURPOSES_SUCCESS:
  case ActionTypes.FETCH_RESOURCE_SUCCESS:
  case ActionTypes.FETCH_RESOURCES_SUCCESS:
  case ActionTypes.FETCH_UNITS_SUCCESS:
    return handleData(state, action.payload.entities);

  case ActionTypes.MAKE_RESERVATION_SUCCESS:
    const reservation = action.payload;
    const reservations = state.resources[reservation.resource].reservations;
    const entities = {
      resources: {
        [reservation.resource]: {
          reservations: [...reservations, reservation],
        },
      },
    };

    return handleData(state, entities);

  default:
    return state;
  }
}
