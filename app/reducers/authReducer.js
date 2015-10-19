import Immutable from 'seamless-immutable';

import ActionTypes from 'constants/ActionTypes';

const initialState = Immutable({
  userId: null,
});

export function authReducer(state = initialState, action) {
  switch (action.type) {

  case ActionTypes.LOGIN:
    const { userId } = action.payload;

    return state.merge({ userId: userId });

  case ActionTypes.LOGOUT:
    return initialState;

  default:
    return state;
  }
}
