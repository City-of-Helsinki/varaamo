import { createSelector } from 'reselect';
import Immutable from 'seamless-immutable';

import { combine } from 'utils/reservationUtils';

const idSelector = (state, props) => props.params.id;
const selectedSelector = state => state.ui.reservations.selected;

const selectedReservationsSelector = createSelector(
  idSelector,
  selectedSelector,
  (id, selected) => {
    const selectedSlots = selected.map((current) => {
      const dateTimes = current.split('/');
      return {
        begin: dateTimes[0],
        end: dateTimes[1],
        resource: id,
      };
    });
    const selectedReservations = Immutable(combine(selectedSlots));

    return selectedReservations;
  }
);

export default selectedReservationsSelector;
