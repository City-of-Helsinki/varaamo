import { createSelector } from 'reselect';

import ActionTypes from 'constants/ActionTypes';
import ModalTypes from 'constants/ModalTypes';
import modalIsOpenSelectorFactory from 'selectors/factories/modalIsOpenSelectorFactory';
import requestIsActiveSelectorFactory from 'selectors/factories/requestIsActiveSelectorFactory';
import sortedReservationsSelector from 'selectors/sortedReservationsSelector';

const resourcesSelector = (state) => state.data.resources;
const unitsSelector = (state) => state.data.units;

const userReservationsPageSelector = createSelector(
  modalIsOpenSelectorFactory(ModalTypes.DELETE_RESERVATION),
  requestIsActiveSelectorFactory(ActionTypes.API.RESERVATIONS_GET_REQUEST),
  resourcesSelector,
  sortedReservationsSelector,
  unitsSelector,
  (
    deleteReservationModalIsOpen,
    isFetchingReservations,
    resources,
    reservations,
    units
  ) => {
    return {
      deleteReservationModalIsOpen,
      isDeletingReservations: false,
      isFetchingReservations,
      reservations,
      resources,
      units,
    };
  }
);

export default userReservationsPageSelector;
