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

function dataReducer(state = initialState, action) {
  switch (action.type) {

  case types.API.PURPOSES_GET_SUCCESS:
  case types.API.RESERVATIONS_GET_SUCCESS:
  case types.API.RESOURCE_GET_SUCCESS:
  case types.API.RESOURCES_GET_SUCCESS:
  case types.API.UNITS_GET_SUCCESS:
    return handleData(state, action.payload.entities);

  case types.API.RESERVATION_POST_SUCCESS:
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

export default dataReducer;
export { handleData };
