import { createSelector } from 'reselect';

import { getOpeningHours } from 'utils/DataUtils';
import { getTimeSlots } from 'utils/TimeUtils';

const dateSelector = (state) => state.ui.reservation.date;
const idSelector = (state) => state.router.params.id;
const isFetchingResourceSelector = (state) => state.api.isFetchingResource;
const resourcesSelector = (state) => state.data.resources;

export const reservationFormSelectors = createSelector(
  dateSelector,
  idSelector,
  isFetchingResourceSelector,
  resourcesSelector,
  (date, id, isFetchingResource, resources) => {
    const resource = resources[id] || {};
    const { closes, opens } = getOpeningHours(resource);
    const period = resource.minPeriod ? resource.minPeriod : undefined;
    const timeSlots = getTimeSlots(opens, closes, period);

    return {
      date,
      id,
      isFetchingResource,
      resource,
      timeSlots,
    };
  }
);
