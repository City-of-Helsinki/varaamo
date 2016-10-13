import Immutable from 'seamless-immutable';

import types from 'constants/ActionTypes';

const initialState = Immutable({
  reservations: 0,
});

function fetchCountsReducer(state = initialState, action) {
  switch (action.type) {

    case types.API.RESERVATIONS_GET_SUCCESS: {
      return state.merge({
        reservations: state.reservations + 1,
      });
    }

    default: {
      return state;
    }
  }
}

export default fetchCountsReducer;
