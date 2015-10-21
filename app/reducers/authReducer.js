import Immutable from 'seamless-immutable';

import types from 'constants/ActionTypes';

const initialState = Immutable({
  userId: null,
});

export function authReducer(state = initialState, action) {
  switch (action.type) {

  case types.API.LOGIN:
    const { userId } = action.payload;
    return state.merge({ userId: userId });

  case types.API.LOGOUT:
    return initialState;

  default:
    return state;
  }
}
