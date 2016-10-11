import filter from 'lodash/filter';
import orderBy from 'lodash/orderBy';
import values from 'lodash/values';
import { createSelector } from 'reselect';

import constants from 'constants/AppConstants';

const reservationsSelector = (state, props) => {
  if (constants.RESERVATION_STATE_LABELS[props.filter]) {
    return filter(state.data.reservations, reservation => (
      reservation.needManualConfirmation && reservation.state === props.filter
    ));
  }
  if (props.filter === 'preliminary' || props.filter === 'all') {
    return filter(state.data.reservations, reservation => reservation.needManualConfirmation);
  }
  if (props.filter === 'regular') {
    return filter(state.data.reservations, reservation => !reservation.needManualConfirmation);
  }
  return state.data.reservations;
};

const sortedReservationsSelector = createSelector(
  reservationsSelector,
  reservations => orderBy(values(reservations), ['begin'], ['asc'])
);

export default sortedReservationsSelector;
