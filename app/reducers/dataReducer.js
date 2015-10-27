import _ from 'lodash';
import Immutable from 'seamless-immutable';

import types from 'constants/ActionTypes';

const mockUsersData = {
  'u-1': {
    id: 'u-1',
    name: 'Luke Skywalker',
  },
};

const initialState = Immutable({
  reservations: {},
  resources: {},
  units: {},
  users: mockUsersData,
});

function handleData(state, data) {
  return state.merge(data, { deep: true });
}

function handleReservationDelete(action, state) {
  const reservation = action.payload;
  return state.merge( { reservations: _.omit(state.reservations, reservation.url) });
}

function handleReservationPost(state, action) {
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
}

function dataReducer(state = initialState, action) {
  switch (action.type) {

  case types.API.PURPOSES_GET_SUCCESS:
  case types.API.RESERVATIONS_GET_SUCCESS:
  case types.API.RESOURCE_GET_SUCCESS:
  case types.API.RESOURCES_GET_SUCCESS:
  case types.API.SEARCH_RESULTS_GET_SUCCESS:
  case types.API.UNITS_GET_SUCCESS:
    return handleData(state, action.payload.entities);

  case types.API.RESERVATION_POST_SUCCESS:
    return handleReservationPost(state, action);

  case types.API.RESERVATION_DELETE_SUCCESS:
    return handleReservationDelete(action, state);

  default:
    return state;
  }
}

export default dataReducer;
export { handleData };
