import find from 'lodash/find';
import first from 'lodash/first';
import last from 'lodash/last';
import orderBy from 'lodash/orderBy';
import without from 'lodash/without';
import moment from 'moment';
import Immutable from 'seamless-immutable';

import types from 'constants/ActionTypes';
import ModalTypes from 'constants/ModalTypes';
import { getTimeSlots } from 'utils/timeUtils';

const initialState = Immutable({
  adminReservationFilters: {
    state: 'all',
  },
  failed: [],
  selected: [],
  selectedSlot: null,
  toCancel: [],
  toEdit: [],
  toShow: [],
});

function selectReservationToEdit(state, action) {
  const { minPeriod, reservation } = action.payload;
  const selected = getTimeSlots(reservation.begin, reservation.end, minPeriod).map(
    slot => ({
      begin: slot.start,
      end: slot.end,
      resource: reservation.resource,
    })
  );
  return state.merge({
    selected,
    toEdit: [reservation],
  });
}

function parseError(error) {
  if (error.response && error.response.non_field_errors && error.response.non_field_errors.length) {
    return error.response.non_field_errors.join('. ').replace('[\'', '').replace('\']', '');
  } else if (error.response && error.response.detail) {
    return error.response.detail;
  }
  return 'Jotain meni vikaan';
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

    case types.API.RESERVATION_POST_ERROR: {
      const reservation = action.meta.reservation;
      const failReason = parseError(action.payload);
      return state.merge({
        failed: [...state.failed, { ...reservation, failReason }],
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
      if (modal === ModalTypes.RESERVATION_SUCCESS) {
        return state.merge({ failed: [], toShow: [] });
      }
      return state;
    }

    case types.UI.SELECT_RESERVATION_TO_CANCEL: {
      return state.merge({ toCancel: [...state.toCancel, action.payload] });
    }

    case types.UI.SELECT_RESERVATION_TO_EDIT: {
      return selectReservationToEdit(state, action);
    }

    case types.UI.SELECT_RESERVATION_SLOT: {
      return state.merge({ selectedSlot: action.payload });
    }

    case types.UI.SELECT_RESERVATION_TO_SHOW: {
      return state.merge({ toShow: [...state.toShow, action.payload] });
    }

    case types.UI.TOGGLE_TIME_SLOT: {
      const slot = action.payload;
      const stateSlot = find(state.selected, slot);
      if (stateSlot) {
        return state.merge({ selected: without(state.selected, stateSlot) });
      } else if (state.selected.length <= 1) {
        return state.merge({ selected: [...state.selected, slot] });
      }
      const orderedSelected = orderBy(state.selected, 'begin');
      const firstSelected = first(orderedSelected);
      const lastSelected = last(orderedSelected);
      if (moment(lastSelected.start).isSameOrAfter(slot.start)) {
        return state.merge({ selected: [...without(state.selected, lastSelected), slot] });
      }
      if (moment(firstSelected.start).isSameOrAfter(slot.start) &&
        moment(lastSelected.start).isSameOrBefore(slot.start)) {
        return state.merge({ selected: [...without(state.selected, lastSelected), slot] });
      }
      return state.merge({ selected: [...state.selected, slot] });
    }

    default: {
      return state;
    }
  }
}

export default reservationsReducer;
