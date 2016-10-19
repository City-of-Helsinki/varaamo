import Immutable from 'seamless-immutable';

import types from 'constants/ActionTypes';
import constants from 'constants/AppConstants';

const initialState = Immutable({});

function addNotification(state, notification) {
  return [...state, Object.assign(
    {},
    constants.NOTIFICATION_DEFAULTS,
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

function getErrorMessage(error) {
  let message = 'Jotain meni vikaan. Yritä hetken päästä uudelleen.';

  if (error.status === 401) {
    message = 'Kirjaudu sisään jatkaaksesi.';
  } else if (error.response.non_field_errors && error.response.non_field_errors.length) {
    message = error.response.non_field_errors.join('. ');
  } else if (error.response.detail) {
    message = error.response.detail;
  }

  if (!message.endsWith('.')) {
    message += '.';
  }

  return message;
}

function notificationsReducer(state = initialState, action) {
  let message;
  let notification;
  switch (action.type) {

  // Notification handling

    case types.UI.ADD_NOTIFICATION: {
      notification = action.payload;
      return addNotification(state, notification);
    }

    case types.UI.HIDE_NOTIFICATION: {
      const index = action.payload.id - 1;
      return hideNotification(state, index);
    }

    // Success messages

    case types.API.RESERVATION_DELETE_SUCCESS: {
      notification = {
        message: 'Varauksen peruminen onnistui.',
        type: 'success',
      };
      return addNotification(state, notification);
    }

    case types.API.RESERVATION_PUT_SUCCESS: {
      notification = {
        message: 'Varaus päivitetty.',
        type: 'success',
      };
      return addNotification(state, notification);
    }

    // Error messages

    case types.API.RESERVATION_DELETE_ERROR:
    case types.API.RESERVATION_POST_ERROR:
    case types.API.RESERVATION_PUT_ERROR: {
      message = getErrorMessage(action.payload);
      notification = {
        message,
        type: 'error',
        timeOut: 10000,
      };
      return addNotification(state, notification);
    }

    default: {
      return state;
    }
  }
}

export default notificationsReducer;
