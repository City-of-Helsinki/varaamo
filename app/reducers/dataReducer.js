import Immutable from 'seamless-immutable';

import types from 'constants/ActionTypes';

export default {
  dataReducer,
  handleData,
};

const mockUsersData = {
  'u-1': {
    id: 'u-1',
    name: 'Luke Skywalker',
  },
};

const initialState = Immutable({
  resources: {},
  units: {},
  users: mockUsersData,
});

function handleData(state, data) {
  return state.merge(data, { deep: true });
}

function dataReducer(state = initialState, action) {
  switch (action.type) {

  case types.API.FETCH_PURPOSES_SUCCESS:
  case types.API.FETCH_RESOURCE_SUCCESS:
  case types.API.FETCH_RESOURCES_SUCCESS:
  case types.API.FETCH_UNITS_SUCCESS:
    return handleData(state, action.payload.entities);

  case types.API.MAKE_RESERVATION_SUCCESS:
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
