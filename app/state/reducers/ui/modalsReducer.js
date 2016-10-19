import without from 'lodash/without';
import includes from 'lodash/includes';
import Immutable from 'seamless-immutable';

import types from 'constants/ActionTypes';
import ModalTypes from 'constants/ModalTypes';

const initialState = Immutable({
  open: [],
});

function modalsReducer(state = initialState, action) {
  let modal;

  switch (action.type) {

    case types.API.RESERVATION_POST_SUCCESS: {
      modal = ModalTypes.RESERVATION_SUCCESS;
      return state.merge({ open: [...state.open, modal] });
    }

    case types.UI.CLOSE_MODAL: {
      modal = action.payload;

      if (includes(state.open, modal)) {
        return state.merge({ open: without(state.open, modal) });
      }

      return state;
    }

    case types.UI.OPEN_MODAL: {
      modal = action.payload;

      if (includes(state.open, modal)) {
        return state;
      }

      return state.merge({ open: [...state.open, modal] });
    }

    default: {
      return state;
    }
  }
}

export default modalsReducer;
