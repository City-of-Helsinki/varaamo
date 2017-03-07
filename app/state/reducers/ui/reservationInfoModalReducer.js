import Immutable from 'seamless-immutable';

import types from 'constants/ActionTypes';

const initialState = Immutable({
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
      return state.merge({ show: false });
    }

    default: {
      return state;
    }
  }
}

export default reservationInfoModalReducer;
