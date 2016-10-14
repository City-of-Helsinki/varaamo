import { formValueSelector } from 'redux-form';
import { createSelector } from 'reselect';

import ActionTypes from 'constants/ActionTypes';
import ModalTypes from 'constants/ModalTypes';
import resourceSelector from 'state/selectors/resourceSelector';
import selectedReservationsSelector from 'state/selectors/selectedReservationsSelector';
import staffUnitsSelector from 'state/selectors/staffUnitsSelector';
import modalIsOpenSelectorFactory from 'state/selectors/factories/modalIsOpenSelectorFactory';
import requestIsActiveSelectorFactory from 'state/selectors/factories/requestIsActiveSelectorFactory';

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
