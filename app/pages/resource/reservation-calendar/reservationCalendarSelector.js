import { createSelector, createStructuredSelector } from 'reselect';

import ActionTypes from 'constants/ActionTypes';
import { isAdminSelector, isLoggedInSelector } from 'state/selectors/authSelectors';
import { createResourceSelector } from 'state/selectors/dataSelectors';
import dateSelector from 'state/selectors/dateSelector';
import timeSelector from 'state/selectors/timeSelector';
import staffUnitsSelector from 'state/selectors/staffUnitsSelector';
import requestIsActiveSelectorFactory from 'state/selectors/factories/requestIsActiveSelectorFactory';
import { getOpeningHours, getOpenReservations } from 'utils/resourceUtils';
import { getTimeSlots } from 'utils/timeUtils';

const resourceIdSelector = (state, props) => props.params.id;
const resourceSelector = createResourceSelector(resourceIdSelector);
const selectedSelector = state => state.ui.reservations.selected;
const toEditSelector = state => state.ui.reservations.toEdit;
const urlHashSelector = (state, props) => props.location.hash;

const isEditingSelector = createSelector(
  toEditSelector,
  reservationsToEdit => Boolean(reservationsToEdit.length)
);

const timeSlotsSelector = createSelector(
  resourceSelector,
  toEditSelector,
  (resource, reservationsToEdit) => {
    const { closes, opens } = getOpeningHours(resource);
    const period = resource.minPeriod ? resource.minPeriod : undefined;
    const reservations = getOpenReservations(resource);
    return getTimeSlots(opens, closes, period, reservations, reservationsToEdit);
  }
);

const reservationCalendarSelector = createStructuredSelector({
  date: dateSelector,
  isAdmin: isAdminSelector,
  isEditing: isEditingSelector,
  isFetchingResource: requestIsActiveSelectorFactory(ActionTypes.API.RESOURCE_GET_REQUEST),
  isLoggedIn: isLoggedInSelector,
  isMakingReservations: requestIsActiveSelectorFactory(ActionTypes.API.RESERVATION_POST_REQUEST),
  resource: resourceSelector,
  selected: selectedSelector,
  staffUnits: staffUnitsSelector,
  time: timeSelector,
  timeSlots: timeSlotsSelector,
  urlHash: urlHashSelector,
});

export default reservationCalendarSelector;
