import { createSelector } from 'reselect';

import { getDateString } from 'utils/TimeUtils';

const dateSelector = (state) => state.ui.reservation.date;

const reservationDateSelector = createSelector(
  dateSelector,
  (date) => {
    return getDateString(date);
  }
);

export default reservationDateSelector;
