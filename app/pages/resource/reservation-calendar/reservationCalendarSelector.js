import filter from 'lodash/filter';
import isEmpty from 'lodash/isEmpty';
import { createSelector, createStructuredSelector } from 'reselect';

import ActionTypes from 'constants/ActionTypes';
import {
  createIsStaffSelector,
  isAdminSelector,
  isLoggedInSelector,
} from 'state/selectors/authSelectors';
import { createResourceSelector } from 'state/selectors/dataSelectors';
import dateSelector from 'state/selectors/dateSelector';
import timeSelector from 'state/selectors/timeSelector';
import requestIsActiveSelectorFactory from 'state/selectors/factories/requestIsActiveSelectorFactory';
import { getOpeningHours, getOpenReservations } from 'utils/resourceUtils';
import { getTimeSlots } from 'utils/timeUtils';

const resourceIdSelector = (state, props) => props.params.id;
const resourceSelector = createResourceSelector(resourceIdSelector);
const selectedSelector = state => state.ui.reservations.selected;
const selectedReservationSlotSelector = state => state.ui.reservations.selectedSlot;
const toEditSelector = state => state.ui.reservations.toEdit;

const isEditingSelector = createSelector(
  toEditSelector,
  reservationsToEdit => Boolean(reservationsToEdit.length)
);

const resourceByDate = createSelector(
  resourceSelector,
  dateSelector,
  (resource, selectedDate) => {
    if (!isEmpty(resource)) {
      return {
        ...resource,
        availableHours: filter(
          resource.availableHours,
          range => range.starts.substring(0, 10) === selectedDate
        ),
        openingHours: filter(
          resource.openingHours,
          ({ date }) => date === selectedDate
        ),
        reservations: filter(
          resource.reservations,
          ({ begin }) => begin.substring(0, 10) === selectedDate
        ),
      };
    }
    return resource;
  }
);

const timeSlotsSelector = createSelector(
  resourceByDate,
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
  isStaff: createIsStaffSelector(resourceSelector),
  resource: resourceSelector,
  selected: selectedSelector,
  selectedReservationSlot: selectedReservationSlotSelector,
  time: timeSelector,
  timeSlots: timeSlotsSelector,
});

export default reservationCalendarSelector;
