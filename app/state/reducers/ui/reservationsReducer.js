import without from 'lodash/without';
import includes from 'lodash/includes';
import Immutable from 'seamless-immutable';

import types from 'constants/ActionTypes';
import ModalTypes from 'constants/ModalTypes';
import { getTimeSlots } from 'utils/timeUtils';

const initialState = Immutable({
  adminReservationFilters: {
    state: 'all',
  },
  selected: [],
  toCancel: [],
  toEdit: [],
  toShow: [],
});

function selectReservationToEdit(state, action) {
  const { minPeriod, reservation } = action.payload;
  const selected = getTimeSlots(reservation.begin, reservation.end, minPeriod).map(
    slot => slot.asISOString
  );

  return state.merge({
    selected,
    toEdit: [reservation],
  });
}

function reservationsReducer(state = initialState, action) {
  switch (action.type) {

    case types.API.RESERVATION_POST_SUCCESS: {
      return state.merge({
        selected: [],
        toEdit: [],
        toShow: [...state.toShow, action.payload],
      });
    }

    case types.API.RESERVATION_PUT_SUCCESS: {
      return state.merge({
        selected: [],
        toEdit: [],
        toShow: [],
      });
    }

    case types.UI.CANCEL_RESERVATION_EDIT: {
      return state.merge({
        selected: [],
        toEdit: [],
      });
    }

    case types.UI.CHANGE_ADMIN_RESERVATIONS_FILTERS: {
      const adminReservationFilters = action.payload;
      return state.merge({ adminReservationFilters }, { deep: true });
    }

    case types.UI.CLEAR_RESERVATIONS: {
      return initialState;
    }

    case types.UI.CLOSE_MODAL: {
      const modal = action.payload;
      if (modal === ModalTypes.RESERVATION_CANCEL) {
        return state.merge({ toCancel: [] });
      }
      if (modal === ModalTypes.RESERVATION_COMMENT) {
        return state.merge({ toShow: [] });
      }
      if (modal === ModalTypes.RESERVATION_INFO) {
        return state.merge({ toShow: [] });
      }
      if (modal === ModalTypes.RESERVATION_SUCCESS) {
        return state.merge({ toShow: [] });
      }
      return state;
    }

    case types.UI.SELECT_RESERVATION_TO_CANCEL: {
      return state.merge({ toCancel: [...state.toCancel, action.payload] });
    }

    case types.UI.SELECT_RESERVATION_TO_EDIT: {
      return selectReservationToEdit(state, action);
    }

    case types.UI.SELECT_RESERVATION_TO_SHOW: {
      return state.merge({ toShow: [...state.toShow, action.payload] });
    }

    case types.UI.TOGGLE_TIME_SLOT: {
      const slot = action.payload;
      if (includes(state.selected, slot)) {
        return state.merge({ selected: without(state.selected, slot) });
      }
      return state.merge({ selected: [...state.selected, slot] });
    }

    default: {
      return state;
    }
  }
}

export default reservationsReducer;
