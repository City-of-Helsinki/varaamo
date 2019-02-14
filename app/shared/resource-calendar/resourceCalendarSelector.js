import isEmpty from 'lodash/isEmpty';
import mapValues from 'lodash/mapValues';
import moment from 'moment';
import { createSelector, createStructuredSelector } from 'reselect';
import { createResourceSelector } from 'state/selectors/dataSelectors';
import { currentLanguageSelector } from 'state/selectors/translationSelectors';
import { getOpenReservations } from 'utils/resourceUtils';

const resourceIdSelector = (state, props) => props.resourceId;
const resourceSelector = createResourceSelector(resourceIdSelector);

const AvailabilitySelector = createSelector(
  resourceSelector,
  (resource) => {
    if (isEmpty(resource)) {
      return resource;
    }
    const availableTimeByDate = {};
    (resource.openingHours || []).forEach(({ closes, date, opens }) => {
      const openMinutes = moment.duration(
        moment(closes).diff(moment(opens)),
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
      if (availableTimeByDate[date]) {
        const reservedMinutes = moment.duration(
          moment(end).diff(moment(begin)),
        ).asMinutes();
        availableTimeByDate[date].reservedMinutes += reservedMinutes;
      }
    });
    return mapValues(availableTimeByDate, date => ({
      ...date,
      percentage: ((date.openMinutes - date.reservedMinutes) * 100) / date.openMinutes,
    }));
  },
);

const reservationCalendarSelector = createStructuredSelector({
  availability: AvailabilitySelector,
  currentLanguage: currentLanguageSelector,
  resource: resourceSelector,
});

export default reservationCalendarSelector;
