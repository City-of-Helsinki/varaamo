import { formValueSelector } from 'redux-form';
import { createSelector, createStructuredSelector } from 'reselect';

import ActionTypes from 'constants/ActionTypes';
import ModalTypes from 'constants/ModalTypes';
import { createIsStaffSelector } from 'state/selectors/authSelectors';
import { createResourceSelector } from 'state/selectors/dataSelectors';
import selectedReservationsFromStateSelector from 'state/selectors/selectedReservationsSelector';
import modalIsOpenSelectorFactory from 'state/selectors/factories/modalIsOpenSelectorFactory';
import requestIsActiveSelectorFactory from 'state/selectors/factories/requestIsActiveSelectorFactory';

const resourceIdSelector = (state, props) => props.params.id;
const resourceSelector = createResourceSelector(resourceIdSelector);
const toEditSelector = state => state.ui.reservations.toEdit;
const staffEventSelectedSelector = state => (
  formValueSelector('preliminaryReservation')(state, 'staffEvent')
);
const selectedReservationsSelector = createSelector(
  (state, props) => props.selectedReservations,
  selectedReservationsFromStateSelector,
  (fromProps, fromState) => fromProps || fromState
);

const reservationCalendarSelector = createStructuredSelector({
  confirmReservationModalIsOpen: modalIsOpenSelectorFactory(ModalTypes.RESERVATION_CONFIRM),
  isMakingReservations: requestIsActiveSelectorFactory(ActionTypes.API.RESERVATION_POST_REQUEST),
  isStaff: createIsStaffSelector(resourceSelector),
  reservationsToEdit: toEditSelector,
  resource: resourceSelector,
  selectedReservations: selectedReservationsSelector,
  staffEventSelected: staffEventSelectedSelector,
});

export default reservationCalendarSelector;
