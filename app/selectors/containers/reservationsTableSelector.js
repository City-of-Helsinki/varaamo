import { createSelector } from 'reselect';

import ActionTypes from 'constants/ActionTypes';
import ModalTypes from 'constants/ModalTypes';
import modalIsOpenSelectorFactory from 'selectors/factories/modalIsOpenSelectorFactory';
import requestIsActiveSelectorFactory from 'selectors/factories/requestIsActiveSelectorFactory';
import sortedReservationsSelector from 'selectors/sortedReservationsSelector';

const toDeleteSelector = (state) => state.ui.reservation.toDelete;
const resourcesSelector = (state) => state.data.resources;
const unitsSelector = (state) => state.data.units;

const reservationsTableSelector = createSelector(
  modalIsOpenSelectorFactory(ModalTypes.DELETE_RESERVATION),
  requestIsActiveSelectorFactory(ActionTypes.API.RESERVATIONS_GET_REQUEST),
  resourcesSelector,
  sortedReservationsSelector,
  toDeleteSelector,
  unitsSelector,
  (
    deleteReservationModalIsOpen,
    isFetchingReservations,
    resources,
    reservations,
    reservationsToDelete,
    units
  ) => {
    return {
      deleteReservationModalIsOpen,
      isDeletingReservations: false,
      isFetchingReservations,
      reservations,
      reservationsToDelete,
      resources,
      units,
    };
  }
);

export default reservationsTableSelector;
