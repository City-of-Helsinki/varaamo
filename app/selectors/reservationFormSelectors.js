import { createSelector } from 'reselect';

import { getOpeningHours } from 'utils/DataUtils';
import { getTimeSlots } from 'utils/TimeUtils';

const dateSelector = (state) => state.ui.reservation.date;
const idSelector = (state) => state.router.params.id;
const isFetchingResourceSelector = (state) => state.api.isFetchingResource;
const pendingReservationsCountSelector = (state) => state.api.pendingReservationsCount;
const resourcesSelector = (state) => state.data.resources;
const selectedSelector = (state) => state.ui.reservation.selected;

export const reservationFormSelectors = createSelector(
  dateSelector,
  idSelector,
  isFetchingResourceSelector,
  pendingReservationsCountSelector,
  resourcesSelector,
  selectedSelector,
  (
    date,
    id,
    isFetchingResource,
    pendingReservationsCount,
    resources,
    selected
  ) => {
    const resource = resources[id] || {};
    const { closes, opens } = getOpeningHours(resource);
    const period = resource.minPeriod ? resource.minPeriod : undefined;
    const reservations = resource.reservations || undefined;
    const timeSlots = getTimeSlots(opens, closes, period, reservations);

    return {
      date,
      id,
      isFetchingResource,
      isMakingReservations: Boolean(pendingReservationsCount),
      resource,
      selected,
      timeSlots,
    };
  }
);
