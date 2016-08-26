import filter from 'lodash/collection/filter';
import sortByOrder from 'lodash/collection/sortByOrder';
import values from 'lodash/object/values';
import { createSelector } from 'reselect';

import constants from 'constants/AppConstants';

const reservationsSelector = (state, props) => {
  if (constants.RESERVATION_STATE_LABELS[props.filter]) {
    return filter(state.data.reservations, (reservation) => reservation.state === props.filter);
  }
  if (props.filter === 'preliminary' || props.filter === 'all') {
    return filter(state.data.reservations, (reservation) => reservation.needManualConfirmation);
  }
  if (props.filter === 'regular') {
    return filter(state.data.reservations, (reservation) => !reservation.needManualConfirmation);
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
