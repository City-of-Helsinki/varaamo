import Immutable from 'seamless-immutable';

import types from 'constants/ActionTypes';
import { NOTIFICATION_DEFAULTS } from 'constants/AppConstants';

const initialState = Immutable({});

function addNotification(state, notification) {
  return [...state, Object.assign(
    {},
    NOTIFICATION_DEFAULTS,
    notification,
    { id: (state.length || 0) + 1 }
  )];
}

function hideNotification(state, index) {
  return [
    ...state.slice(0, index),
    Object.assign({}, state[index], { hidden: true }),
    ...state.slice(index + 1),
  ];
}

function notificationsReducer(state = initialState, action) {
  let message;
  let notification;
  switch (action.type) {

  case types.UI.HIDE_NOTIFICATION:
    const index = action.payload.id - 1;
    return hideNotification(state, index);

  case types.API.LOGIN:
    notification = {
      message: 'Sinut on nyt kirjattu sisään.',
      type: 'success',
    };
    return addNotification(state, notification);

  case types.API.LOGOUT:
    notification = {
      message: 'Sinut on nyt kirjattu ulos. Huom! Kunnes API on valmis, olet yhä rajapinnan puolella kirjautuneena sisään.',
      type: 'success',
    };
    return addNotification(state, notification);

  case types.API.RESERVATION_DELETE_ERROR:
    message = 'Varauksen poistaminen epäonnistui. Yritä hetken kuluttua uudelleen.';
    if (action.payload.status === 401) {
      message = 'Sinulla ei ole oikeutta poistaa varausta.';
    }

    notification = {
      message,
      type: 'error',
      timeOut: 10000,
    };
    return addNotification(state, notification);

  case types.API.RESERVATION_DELETE_SUCCESS:
    notification = {
      message: 'Varauksen poistaminen onnistui.',
      type: 'success',
    };
    return addNotification(state, notification);

  case types.API.RESERVATION_POST_ERROR:
    message = 'Varauksen tekeminen epäonnistui.';
    if (action.payload.status === 401) {
      message = 'Sinulla ei ole oikeutta tehdä varausta.';
    }

    notification = {
      message,
      type: 'error',
      timeOut: 10000,
    };
    return addNotification(state, notification);

  case types.API.RESERVATION_POST_SUCCESS:
    notification = {
      message: 'Varauksen tekeminen onnistui.',
      type: 'success',
    };
    return addNotification(state, notification);

  case types.API.RESERVATION_PUT_ERROR:
    message = 'Varauksen muuttaminen epäonnistui.';
    if (action.payload.status === 401) {
      message = 'Sinulla ei ole oikeutta muuttaa varausta.';
    }

    notification = {
      message,
      type: 'error',
      timeOut: 10000,
    };
    return addNotification(state, notification);

  case types.API.RESERVATION_PUT_SUCCESS:
    notification = {
      message: 'Varauksen muuttaminen onnistui.',
      type: 'success',
    };
    return addNotification(state, notification);

  default:
    return state;
  }
}

export default notificationsReducer;
