import filter from 'lodash/collection/filter';
import sortByOrder from 'lodash/collection/sortByOrder';
import values from 'lodash/object/values';
import { createSelector } from 'reselect';

const reservationsSelector = (state, props) => {
  if (props.filter === 'preliminary') {
    return filter(state.data.reservations, (reservation) => reservation.id % 5 !== 4);
  }
  if (props.filter === 'regular') {
    return filter(state.data.reservations, (reservation) => reservation.id % 5 === 4);
  }
  return state.data.reservations;
};

const sortedReservationsSelector = createSelector(
  reservationsSelector,
  (reservations) => {
    return sortByOrder(values(reservations), ['begin'], ['asc']);
  }
);

export default sortedReservationsSelector;
