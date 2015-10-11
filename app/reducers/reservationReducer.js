import ActionTypes from 'constants/ActionTypes';

export function reservationReducer(state, action) {
  switch (action.type) {

  case ActionTypes.CHANGE_RESERVATION_DATE:
    const date = action.payload;
    return state.merge({ date });

  default:
    return state;
  }
}
