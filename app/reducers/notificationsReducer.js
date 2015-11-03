import Immutable from 'seamless-immutable';

import types from 'constants/ActionTypes';
import { NOTIFICATION_DEFAULTS } from 'constants/AppConstants';

const initialState = Immutable({});

function addNotification(state, notification) {
  return [...state, Object.assign({}, NOTIFICATION_DEFAULTS, notification)];
}

function hideNotification(state, index) {
  return [
    ...state.slice(0, index),
    Object.assign({}, state[index], { hidden: true }),
    ...state.slice(index + 1),
  ];
}

function notificationsReducer(state = initialState, action) {
  switch (action.type) {

  case types.UI.HIDE_NOTIFICATION:
    const index = action.payload.id - 1;
    return hideNotification(state, index);

  case types.API.LOGIN:
    const notification = {
      id: (state.length || 0) + 1,
      message: 'Olet nyt kirjautunut sisään.',
      type: 'success',
    };
    return addNotification(state, notification);

  default:
    return state;
  }
}

export default notificationsReducer;
