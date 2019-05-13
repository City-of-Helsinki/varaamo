import ActionTypes from 'constants/ActionTypes';

import filter from 'lodash/filter';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import { createSelector, createStructuredSelector } from 'reselect';
import Moment from 'moment';
import { extendMoment } from 'moment-range';

import {
  createIsStaffSelector,
  isAdminSelector,
  isLoggedInSelector,
} from 'state/selectors/authSelectors';
import { createResourceSelector } from 'state/selectors/dataSelectors';
import dateSelector from 'state/selectors/dateSelector';
import timeSelector from 'state/selectors/timeSelector';
import requestIsActiveSelectorFactory from 'state/selectors/factories/requestIsActiveSelectorFactory';
import utils from './utils';


const moment = extendMoment(Moment);

const resourceIdSelector = (state, props) => props.params.id;
const resourceSelector = createResourceSelector(resourceIdSelector);
const selectedSelector = state => state.ui.reservations.selected;
const selectedReservationSlotSelector = state => state.ui.reservations.selectedSlot;
const toEditSelector = state => state.ui.reservations.toEdit;
const daySlotsSelector = state => state.ui.timeSlot.daySlots;
const startSlotSelector = state => state.ui.timeSlot.startSlot;
const endSlotSelector = state => state.ui.timeSlot.endSlot;

const isEditingSelector = createSelector(
  toEditSelector,
  reservationsToEdit => Boolean(reservationsToEdit.length)
);

const dateRangeSelector = createSelector(
  dateSelector,
  (selectedDate) => {
    const nextWeekDays = utils.getNextWeeksDays(selectedDate);
    const startDate = moment(selectedDate).startOf('week').format('YYYY-MM-DD');
    const endDate = moment(selectedDate).endOf('week').add(nextWeekDays, 'days').format('YYYY-MM-DD');
    const range = moment.range(moment(startDate), moment(endDate));
    const rangeDates = map(Array.from(range.by('days')), date => date.format('YYYY-MM-DD'));

    return rangeDates;
  }
);

const resourceByDates = createSelector(
  resourceSelector,
  dateRangeSelector,
  (resource, rangeDates) => {
    if (!isEmpty(resource)) {
      return rangeDates.map(rangeDate => ({
        ...resource,
        availableHours: filter(
          resource.availableHours,
          range => range.starts.substring(0, 10) === rangeDate
        ),
        openingHours: filter(
          resource.openingHours,
          ({ date }) => date === rangeDate
        ),
        reservations: filter(
          resource.reservations,
          ({ begin }) => begin.substring(0, 10) === rangeDate
        ),
      }));
    }
    return [resource];
  }
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
  resourceDates: resourceByDates,
  reservationToEdit: toEditSelector,
  daySlots: daySlotsSelector,
  startSlotSelector,
  endSlotSelector
});

export default reservationCalendarSelector;
