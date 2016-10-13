import { createSelector } from 'reselect';

import ActionTypes from 'constants/ActionTypes';
import ModalTypes from 'constants/ModalTypes';
import isAdminSelector from 'selectors/isAdminSelector';
import staffUnitsSelector from 'selectors/staffUnitsSelector';
import modalIsOpenSelectorFactory from 'selectors/factories/modalIsOpenSelectorFactory';
import requestIsActiveSelectorFactory from 'selectors/factories/requestIsActiveSelectorFactory';

const reservationsToShowSelector = state => state.ui.reservations.toShow;
const resourcesSelector = state => state.data.resources;

const reservationInfoModalSelector = createSelector(
  isAdminSelector,
  requestIsActiveSelectorFactory(ActionTypes.API.RESERVATION_PUT_REQUEST),
  modalIsOpenSelectorFactory(ModalTypes.RESERVATION_INFO),
  reservationsToShowSelector,
  resourcesSelector,
  staffUnitsSelector,
  (
    isAdmin,
    isEditingReservations,
    reservationInfoModalIsOpen,
    reservationsToShow,
    resources,
    staffUnits
  ) => {
    const reservation = reservationsToShow[0] || {};
    const resource = reservation.resource ? resources[reservation.resource] : {};
    return {
      isAdmin,
      isEditingReservations,
      reservation,
      resource,
      show: reservationInfoModalIsOpen,
      staffUnits,
    };
  }
);

export default reservationInfoModalSelector;
