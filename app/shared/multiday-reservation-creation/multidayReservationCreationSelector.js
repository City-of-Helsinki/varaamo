import { createStructuredSelector } from 'reselect';
import { formValueSelector } from 'redux-form';

import ActionTypes from '../../constants/ActionTypes';
import FormTypes from '../../constants/FormTypes';
import ModalTypes from '../../constants/ModalTypes';
import { createIsStaffSelector } from '../../state/selectors/authSelectors';
import { createResourceSelector } from '../../state/selectors/dataSelectors';
import modalIsOpenSelectorFactory from '../../state/selectors/factories/modalIsOpenSelectorFactory';
import requestIsActiveSelectorFactory from '../../state/selectors/factories/requestIsActiveSelectorFactory';

const selectedMultidaySlotSelector = state => state.ui.reservations.selectedMultidaySlot;
const resourceIdSelector = state => state.ui.reservations.selectedMultidaySlot.resourceId;
const resourceSelector = createResourceSelector(resourceIdSelector);
const staffEventSelectedSelector = state => (
  formValueSelector(FormTypes.RESERVATION)(state, 'staffEvent')
);
const reservationSelector = state => (state.ui.reservations.selected.length ? state.ui.reservations.selected[0] : null);

const multidayReservationCreationSelector = createStructuredSelector({
  selectedMultidaySlot: selectedMultidaySlotSelector,
  createMultidayReservationModalIsOpen: modalIsOpenSelectorFactory(ModalTypes.MULTIDAY_RESERVATION_CREATE),
  isMakingReservations: requestIsActiveSelectorFactory(ActionTypes.API.RESERVATION_POST_REQUEST),
  isStaff: createIsStaffSelector(resourceSelector),
  resource: resourceSelector,
  staffEventSelected: staffEventSelectedSelector,
  reservation: reservationSelector,
});

export default multidayReservationCreationSelector;
