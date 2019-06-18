import Immutable from 'seamless-immutable';

import types from '../../../constants/ActionTypes';

const initialState = Immutable({
  isEditing: false,
  reservation: null,
  show: false,
});

function reservationInfoModalReducer(state = initialState, action) {
  switch (action.type) {
    case types.API.RESERVATION_DELETE_SUCCESS: {
      return initialState;
    }

    case types.API.RESERVATION_PUT_SUCCESS: {
      return state.merge({
        isEditing: false,
        reservation: action.payload,
      });
    }

    case types.UI.SHOW_RESERVATION_INFO_MODAL: {
      return state.merge({
        reservation: action.payload,
        show: true,
      });
    }

    case types.UI.HIDE_RESERVATION_INFO_MODAL: {
      return state.merge({ isEditing: false, show: false });
    }

    case types.UI.START_RESERVATION_EDIT_IN_INFO_MODAL: {
      return state.merge({ isEditing: true });
    }

    case types.UI.CANCEL_RESERVATION_EDIT_IN_INFO_MODAL: {
      return state.merge({ isEditing: false });
    }

    default: {
      return state;
    }
  }
}

export default reservationInfoModalReducer;
