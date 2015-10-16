import { createAction } from 'redux-actions';

import types from 'constants/ActionTypes';
import ModalTypes from 'constants/ModalTypes';

const changeReservationDate = createAction(types.CHANGE_RESERVATION_DATE);

const changeSearchFilters = createAction(types.CHANGE_SEARCH_FILTERS);

const closeConfirmReservationModal = createAction(
  types.CLOSE_MODAL,
  () => ModalTypes.CONFIRM_RESERVATION
);

const openConfirmReservationModal = createAction(
  types.OPEN_MODAL,
  () => ModalTypes.CONFIRM_RESERVATION
);

const toggleTimeSlot = createAction(types.TOGGLE_TIME_SLOT);

export default {
  changeReservationDate,
  changeSearchFilters,
  closeConfirmReservationModal,
  openConfirmReservationModal,
  toggleTimeSlot,
};
