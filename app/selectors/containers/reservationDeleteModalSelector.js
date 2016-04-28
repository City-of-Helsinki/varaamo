import { createSelector } from 'reselect';

import ActionTypes from 'constants/ActionTypes';
import ModalTypes from 'constants/ModalTypes';
import modalIsOpenSelectorFactory from 'selectors/factories/modalIsOpenSelectorFactory';
import requestIsActiveSelectorFactory from 'selectors/factories/requestIsActiveSelectorFactory';

const toDeleteSelector = (state) => state.ui.reservation.toDelete;
const resourcesSelector = (state) => state.data.resources;

const reservationDeleteModalSelector = createSelector(
  modalIsOpenSelectorFactory(ModalTypes.DELETE_RESERVATION),
  requestIsActiveSelectorFactory(ActionTypes.API.RESERVATION_DELETE_REQUEST),
  resourcesSelector,
  toDeleteSelector,
  (
    deleteReservationModalIsOpen,
    isDeletingReservations,
    resources,
    reservationsToDelete
  ) => {
    return {
      isDeletingReservations,
      reservationsToDelete,
      resources,
      show: deleteReservationModalIsOpen,
    };
  }
);

export default reservationDeleteModalSelector;
