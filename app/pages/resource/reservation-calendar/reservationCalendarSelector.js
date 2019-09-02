import { createSelector, createStructuredSelector } from 'reselect';

import ActionTypes from '../../../constants/ActionTypes';
import {
  createIsStaffSelector,
  isAdminSelector,
  isLoggedInSelector,
} from '../../../state/selectors/authSelectors';
import { createResourceSelector } from '../../../state/selectors/dataSelectors';
import dateSelector from '../../../state/selectors/dateSelector';
import timeSelector from '../../../state/selectors/timeSelector';
import requestIsActiveSelectorFactory from '../../../state/selectors/factories/requestIsActiveSelectorFactory';

const resourceIdSelector = (state, props) => props.params.id;
const resourceSelector = createResourceSelector(resourceIdSelector);
const selectedSelector = state => state.ui.reservations.selected;
const selectedReservationSlotSelector = state => state.ui.reservations.selectedSlot;
const toEditSelector = state => state.ui.reservations.toEdit;

const isEditingSelector = createSelector(
  toEditSelector,
  reservationsToEdit => Boolean(reservationsToEdit.length)
);

const reservationCalendarSelector = createStructuredSelector({
  date: dateSelector,
  isAdmin: isAdminSelector,
  isEditing: isEditingSelector,
  isFetchingResource: requestIsActiveSelectorFactory(ActionTypes.API.RESOURCE_GET_REQUEST),
  isLoggedIn: isLoggedInSelector,
  isStaff: createIsStaffSelector(resourceSelector),
  resource: resourceSelector,
  selected: selectedSelector,
  selectedReservationSlot: selectedReservationSlotSelector,
  time: timeSelector,
});

export default reservationCalendarSelector;
