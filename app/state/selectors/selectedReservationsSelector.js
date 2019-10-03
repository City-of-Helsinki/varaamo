import { createSelector } from 'reselect';
import Immutable from 'seamless-immutable';

import { combine } from '../../utils/reservationUtils';

const selectedSelector = state => state.ui.reservations.selected;

const selectedReservationsSelector = createSelector(
  selectedSelector,
  (selected) => {
    const selectedReservations = Immutable(combine(selected));
    return selectedReservations;
  }
);

export default selectedReservationsSelector;
