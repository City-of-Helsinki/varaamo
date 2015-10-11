import { createSelector } from 'reselect';

import { getOpeningHours } from 'utils/DataUtils';
import { getTimeSlots } from 'utils/ReservationUtils';

const dateSelector = (state) => state.ui.reservation.date;
const idSelector = (state) => state.router.params.id;
const resourcesSelector = (state) => state.data.resources;

export const reservationFormSelectors = createSelector(
  dateSelector,
  idSelector,
  resourcesSelector,
  (date, id, resources) => {
    const resource = resources[id] || {};
    const { closes, opens } = getOpeningHours(resource);
    const period = resource.minPeriod ? resource.minPeriod : undefined;
    const timeSlots = getTimeSlots(opens, closes, period);

    return {
      date,
      id,
      resource,
      timeSlots,
    };
  }
);
