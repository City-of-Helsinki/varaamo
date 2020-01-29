import Immutable from 'seamless-immutable';

import types from '../../constants/ActionTypes';
import { NOTIFICATION_DEFAULT } from '../../../src/common/notification/constants';

const initialState = Immutable([]);

function addNotification(state, notification) {
  const mutableState = Immutable.asMutable(state);

  mutableState.push(Object.assign(
    {},
    NOTIFICATION_DEFAULT,
    notification,
    { id: (state.length || 0) + 1 },
  ));

  return Immutable(mutableState);
}

function hideNotification(state, index) {
  return Number(index) >= 0 ? state.setIn([index, 'hidden'], true) : state;
}

function getErrorNotification(error) {
  const defaults = {
    messageId: 'Notifications.errorMessage',
    type: 'error',
    timeOut: 10000,
  };

  if (error.status === 401) {
    return {
      ...defaults,
      messageId: 'Notifications.loginMessage',
    };
  } if (
    error.response
    && error.response.non_field_errors
    && error.response.non_field_errors.length
  ) {
    return {
      ...defaults,
      message: error.response.non_field_errors.join('. '),
    };
  } if (error.response && error.response.detail) {
    return {
      ...defaults,
      message: error.response.detail,
    };
  }
  return defaults;
}

function notificationsReducer(state = initialState, action) {
  switch (action.type) {
  // Notification handling

    case types.UI.ADD_NOTIFICATION: {
      const notification = action.payload;
      return addNotification(state, notification);
    }

    case types.UI.HIDE_NOTIFICATION: {
      const index = action.payload.id - 1;
      return hideNotification(state, index);
    }

    // Success messages

    case types.API.RESERVATION_DELETE_SUCCESS: {
      const notification = {
        messageId: 'Notifications.reservationDeleteSuccessMessage',
        type: 'success',
      };
      return addNotification(state, notification);
    }

    case types.API.RESERVATION_PUT_SUCCESS: {
      const notification = {
        messageId: 'Notifications.reservationUpdateSuccessMessage',
        type: 'success',
      };
      return addNotification(state, notification);
    }

    // Error messages

    case types.API.RESERVATION_DELETE_ERROR:
    case types.API.RESERVATION_POST_ERROR:
    case types.API.RESERVATION_PUT_ERROR: {
      return addNotification(state, getErrorNotification(action.payload));
    }

    default: {
      return state;
    }
  }
}

export default notificationsReducer;
