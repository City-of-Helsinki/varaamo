import { createAction } from 'redux-actions';

import types from 'constants/ActionTypes';
import ModalTypes from 'constants/ModalTypes';

const changeReservationDate = createAction(types.UI.CHANGE_RESERVATION_DATE);

const changeSearchFilters = createAction(types.UI.CHANGE_SEARCH_FILTERS);

const closeDeleteReservationModal = createAction(
  types.UI.CLOSE_MODAL,
  () => ModalTypes.DELETE_RESERVATION
);

const closeConfirmReservationModal = createAction(
  types.UI.CLOSE_MODAL,
  () => ModalTypes.CONFIRM_RESERVATION
);

const openDeleteReservationModal = createAction(
  types.UI.OPEN_MODAL,
  () => ModalTypes.DELETE_RESERVATION
);

const openConfirmReservationModal = createAction(
  types.UI.OPEN_MODAL,
  () => ModalTypes.CONFIRM_RESERVATION
);

const toggleTimeSlot = createAction(types.UI.TOGGLE_TIME_SLOT);

export default {
  changeReservationDate,
  changeSearchFilters,
  closeDeleteReservationModal,
  closeConfirmReservationModal,
  openDeleteReservationModal,
  openConfirmReservationModal,
  toggleTimeSlot,
};
