import isEmpty from 'lodash/isEmpty';
import mapValues from 'lodash/mapValues';
import moment from 'moment';
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
import { currentLanguageSelector } from 'state/selectors/translationSelectors';
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

const resourceByDate = createSelector(
  resourceSelector,
  dateSelector,
  (resource, selectedDate) => {
    if (!isEmpty(resource)) {
      return {
        ...resource,
        availableHours: resource.availableHours.filter(
          range => range.starts.substring(0, 10) === selectedDate
        ),
        openingHours: resource.openingHours.filter(({ date }) => date === selectedDate),
        reservations: resource.reservations.filter(
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

const AvailabilitySelector = createSelector(
  resourceSelector,
  (resource) => {
    if (isEmpty(resource)) {
      return resource;
    }
    const availableTimeByDate = {};
    resource.openingHours.forEach(({ closes, date, opens }) => {
      const openMinutes = moment.duration(
        moment(closes).diff(moment(opens))
      ).asMinutes();
      if (availableTimeByDate[date]) {
        availableTimeByDate[date].openMinutes += openMinutes;
      } else {
        availableTimeByDate[date] = {
          reservedMinutes: 0,
          openMinutes,
        };
      }
    });
    getOpenReservations(resource).forEach(({ begin, end }) => {
      const date = begin.substring(0, 10);
      const reservedMinutes = moment.duration(
        moment(end).diff(moment(begin))
      ).asMinutes();
      availableTimeByDate[date].reservedMinutes += reservedMinutes;
    });
    return mapValues(availableTimeByDate, date => ({
      ...date,
      percentage: ((date.openMinutes - date.reservedMinutes) * 100) / date.openMinutes,
    }));
  }
);

const reservationCalendarSelector = createStructuredSelector({
  availability: AvailabilitySelector,
  currentLanguage: currentLanguageSelector,
  date: dateSelector,
  isAdmin: isAdminSelector,
  isEditing: isEditingSelector,
  isFetchingResource: requestIsActiveSelectorFactory(ActionTypes.API.RESOURCE_GET_REQUEST),
  isLoggedIn: isLoggedInSelector,
  isMakingReservations: requestIsActiveSelectorFactory(ActionTypes.API.RESERVATION_POST_REQUEST),
  isStaff: createIsStaffSelector(resourceSelector),
  resource: resourceSelector,
  selected: selectedSelector,
  time: timeSelector,
  timeSlots: timeSlotsSelector,
  urlHash: urlHashSelector,
});

export default reservationCalendarSelector;
