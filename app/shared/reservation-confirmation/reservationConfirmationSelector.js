import { formValueSelector } from 'redux-form';
import { createSelector, createStructuredSelector } from 'reselect';

import ActionTypes from 'constants/ActionTypes';
import FormTypes from 'constants/FormTypes';
import ModalTypes from 'constants/ModalTypes';
import recurringReservations from 'state/recurringReservations';
import { createIsStaffSelector } from 'state/selectors/authSelectors';
import { createResourceSelector } from 'state/selectors/dataSelectors';
import selectedReservationsFromStateSelector from 'state/selectors/selectedReservationsSelector';
import modalIsOpenSelectorFactory from 'state/selectors/factories/modalIsOpenSelectorFactory';
import requestIsActiveSelectorFactory from 'state/selectors/factories/requestIsActiveSelectorFactory';

const resourceIdSelector = (state, props) => props.params.id;
const resourceSelector = createResourceSelector(resourceIdSelector);
const toEditSelector = state => state.ui.reservations.toEdit;
const staffEventSelectedSelector = state => (
  formValueSelector(FormTypes.RESERVATION)(state, 'staffEvent')
);
const selectedReservationsSelector = createSelector(
  (state, props) => props.selectedReservations,
  selectedReservationsFromStateSelector,
  (fromProps, fromState) => fromProps || fromState,
);

const reservationConfirmationSelector = createStructuredSelector({
  confirmReservationModalIsOpen: modalIsOpenSelectorFactory(ModalTypes.RESERVATION_CONFIRM),
  isMakingReservations: requestIsActiveSelectorFactory(ActionTypes.API.RESERVATION_POST_REQUEST),
  isStaff: createIsStaffSelector(resourceSelector),
  recurringReservations: recurringReservations.selectReservations,
  reservationsToEdit: toEditSelector,
  resource: resourceSelector,
  selectedReservations: selectedReservationsSelector,
  staffEventSelected: staffEventSelectedSelector,
});

export default reservationConfirmationSelector;
