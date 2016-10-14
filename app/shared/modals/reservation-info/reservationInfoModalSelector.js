import { createSelector } from 'reselect';

import ActionTypes from 'constants/ActionTypes';
import ModalTypes from 'constants/ModalTypes';
import isAdminSelector from 'state/selectors/isAdminSelector';
import staffUnitsSelector from 'state/selectors/staffUnitsSelector';
import modalIsOpenSelectorFactory from 'state/selectors/factories/modalIsOpenSelectorFactory';
import requestIsActiveSelectorFactory from 'state/selectors/factories/requestIsActiveSelectorFactory';

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
