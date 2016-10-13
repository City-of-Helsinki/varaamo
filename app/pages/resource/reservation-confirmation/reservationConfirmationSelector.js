import { formValueSelector } from 'redux-form';
import { createSelector } from 'reselect';

import ActionTypes from 'constants/ActionTypes';
import ModalTypes from 'constants/ModalTypes';
import resourceSelector from 'selectors/resourceSelector';
import selectedReservationsSelector from 'selectors/selectedReservationsSelector';
import staffUnitsSelector from 'selectors/staffUnitsSelector';
import modalIsOpenSelectorFactory from 'selectors/factories/modalIsOpenSelectorFactory';
import requestIsActiveSelectorFactory from 'selectors/factories/requestIsActiveSelectorFactory';

const toEditSelector = state => state.ui.reservations.toEdit;
const staffEventSelectedSelector = state => (
  formValueSelector('preliminaryReservation')(state, 'staffEvent')
);

const reservationCalendarSelector = createSelector(
  modalIsOpenSelectorFactory(ModalTypes.RESERVATION_CONFIRM),
  requestIsActiveSelectorFactory(ActionTypes.API.RESERVATION_POST_REQUEST),
  resourceSelector,
  selectedReservationsSelector,
  staffEventSelectedSelector,
  staffUnitsSelector,
  toEditSelector,
  (
    confirmReservationModalIsOpen,
    isMakingReservations,
    resource,
    selectedReservations,
    staffEventSelected,
    staffUnits,
    reservationsToEdit,
  ) => ({
    confirmReservationModalIsOpen,
    isMakingReservations,
    reservationsToEdit,
    resource,
    selectedReservations,
    staffEventSelected,
    staffUnits,
  })
);

export default reservationCalendarSelector;
