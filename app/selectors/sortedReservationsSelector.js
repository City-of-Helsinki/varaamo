import sortByOrder from 'lodash/collection/sortByOrder';
import values from 'lodash/object/values';
import { createSelector } from 'reselect';

const reservationsSelector = (state) => state.data.reservations;

const sortedReservationsSelector = createSelector(
  reservationsSelector,
  (reservations) => {
    return sortByOrder(values(reservations), ['begin'], ['asc']);
  }
);

export default sortedReservationsSelector;
