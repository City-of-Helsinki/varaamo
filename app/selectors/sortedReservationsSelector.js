import _ from 'lodash';
import { createSelector } from 'reselect';

const reservationsSelector = (state) => state.data.reservations;

const sortedReservationsSelector = createSelector(
  reservationsSelector,
  (reservations) => {
    return _.sortByOrder(_.values(reservations), ['begin'], ['asc']);
  }
);

export default sortedReservationsSelector;
