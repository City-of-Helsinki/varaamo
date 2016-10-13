import reject from 'lodash/reject';
import mapValues from 'lodash/mapValues';
import Immutable from 'seamless-immutable';

import types from 'constants/ActionTypes';

const initialState = Immutable({
  reservations: {},
  resources: {},
  units: {},
  users: {},
});

function handleData(state, data) {
  return state.merge(data, { deep: true });
}

function handleReservation(state, reservation) {
  const entities = {
    reservations: {
      [reservation.url]: reservation,
    },
  };

  if (state.resources[reservation.resource]) {
    const reservations = reject(
      state.resources[reservation.resource].reservations,
      current => current.url === reservation.url
    );
    entities.resources = {
      [reservation.resource]: {
        reservations: [...reservations, reservation],
      },
    };
  }

  return handleData(state, entities);
}

function dataReducer(state = initialState, action) {
  let reservation;
  switch (action.type) {

    case types.API.PURPOSES_GET_SUCCESS:
    case types.API.RESERVATIONS_GET_SUCCESS:
    case types.API.RESOURCE_GET_SUCCESS:
    case types.API.SEARCH_RESULTS_GET_SUCCESS:
    case types.API.UNITS_GET_SUCCESS: {
      return handleData(state, action.payload.entities);
    }

    case types.API.RESOURCES_GET_SUCCESS: {
      const resources = mapValues(action.payload.entities.resources, (resource) => {
        if (!resource.reservations) {
          delete resource.reservations; // eslint-disable-line
        }
        return resource;
      });
      return handleData(state, { resources });
    }

    case types.API.RESERVATION_POST_SUCCESS:
    case types.API.RESERVATION_PUT_SUCCESS: {
      reservation = action.payload;
      return handleReservation(state, reservation);
    }

    case types.API.RESERVATION_DELETE_SUCCESS: {
      reservation = Object.assign({}, action.payload, { state: 'cancelled' });
      return handleReservation(state, reservation);
    }

    case types.API.USER_GET_SUCCESS: {
      const user = action.payload;
      return handleData(state, { users: { [user.uuid]: user } });
    }

    case types.API.RESOURCE_UNFAVORITE_POST_SUCCESS: {
      const id = action.meta.id;
      return state.setIn(['resources', id, 'isFavorite'], false);
    }
    case types.API.RESOURCE_FAVORITE_POST_SUCCESS: {
      const id = action.meta.id;
      return state.setIn(['resources', id, 'isFavorite'], true);
    }

    default: {
      return state;
    }
  }
}

export default dataReducer;
export { handleData };
