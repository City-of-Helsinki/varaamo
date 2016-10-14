import Immutable from 'seamless-immutable';

import types from 'constants/ActionTypes';

const initialState = Immutable({
  token: null,
  userId: null,
});

function authReducer(state = initialState, action) {
  switch (action.type) {

    case types.API.RESERVATION_DELETE_ERROR:
    case types.API.RESERVATION_PUT_ERROR:
    case types.API.RESERVATION_POST_ERROR: {
      if (action.payload.status === 401) {
        return initialState;
      }
      return state;
    }

    default: {
      return state;
    }
  }
}

export default authReducer;
