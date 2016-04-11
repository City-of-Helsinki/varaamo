import { createAction } from 'redux-actions';

import types from 'constants/ActionTypes';
import ModalTypes from 'constants/ModalTypes';

const cancelReservationEdit = createAction(types.UI.CANCEL_RESERVATION_EDIT);

const changeSearchFilters = createAction(types.UI.CHANGE_SEARCH_FILTERS);

const clearReservations = createAction(types.UI.CLEAR_RESERVATIONS);

const closeConfirmReservationModal = createAction(
  types.UI.CLOSE_MODAL,
  () => ModalTypes.CONFIRM_RESERVATION
);

const closeReservationCancelModal = createAction(
  types.UI.CLOSE_MODAL,
  () => ModalTypes.CANCEL_RESERVATION
);

const closeReservationDeleteModal = createAction(
  types.UI.CLOSE_MODAL,
  () => ModalTypes.DELETE_RESERVATION
);

const closeReservationInfoModal = createAction(
  types.UI.CLOSE_MODAL,
  () => ModalTypes.RESERVATION_INFO
);

const openConfirmReservationModal = createAction(
  types.UI.OPEN_MODAL,
  () => ModalTypes.CONFIRM_RESERVATION
);

const openReservationCancelModal = createAction(
  types.UI.OPEN_MODAL,
  () => ModalTypes.CANCEL_RESERVATION
);

const openReservationDeleteModal = createAction(
  types.UI.OPEN_MODAL,
  () => ModalTypes.DELETE_RESERVATION
);

const openReservationInfoModal = createAction(
  types.UI.OPEN_MODAL,
  () => ModalTypes.RESERVATION_INFO
);

const selectReservationToCancel = createAction(
  types.UI.SELECT_RESERVATION_TO_CANCEL
);

const selectReservationToDelete = createAction(
  types.UI.SELECT_RESERVATION_TO_DELETE
);

const selectReservationToEdit = createAction(
  types.UI.SELECT_RESERVATION_TO_EDIT
);

const selectReservationToShow = createAction(
  types.UI.SELECT_RESERVATION_TO_SHOW
);

const toggleTimeSlot = createAction(types.UI.TOGGLE_TIME_SLOT);

export default {
  cancelReservationEdit,
  changeSearchFilters,
  clearReservations,
  closeConfirmReservationModal,
  closeReservationCancelModal,
  closeReservationDeleteModal,
  closeReservationInfoModal,
  openConfirmReservationModal,
  openReservationCancelModal,
  openReservationDeleteModal,
  openReservationInfoModal,
  selectReservationToCancel,
  selectReservationToDelete,
  selectReservationToEdit,
  selectReservationToShow,
  toggleTimeSlot,
};
