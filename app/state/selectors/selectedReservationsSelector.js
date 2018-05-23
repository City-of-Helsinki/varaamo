import { createSelector } from 'reselect';
import Immutable from 'seamless-immutable';

import { combine } from 'utils/reservationUtils';

const idSelector = (state, props) => props.params.id;
const selectedSelector = state => state.ui.reservations.selected;

const selectedReservationsSelector = createSelector(
  idSelector,
  selectedSelector,
  (id, selected) => {
    const selectedReservations = Immutable(combine(selected));
    return selectedReservations;
  }
);

export default selectedReservationsSelector;
