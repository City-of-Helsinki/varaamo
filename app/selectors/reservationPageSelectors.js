import { createSelector } from 'reselect';

import { getDateString } from 'utils/TimeUtils';

const dateSelector = (state) => state.ui.reservation.date;
const idSelector = (state) => state.router.params.id;
const isFetchingResourceSelector = (state) => state.api.isFetchingResource;
const resourcesSelector = (state) => state.data.resources;
const unitsSelector = (state) => state.data.units;

export const reservationPageSelectors = createSelector(
  dateSelector,
  idSelector,
  isFetchingResourceSelector,
  resourcesSelector,
  unitsSelector,
  (
    date,
    id,
    isFetchingResource,
    resources,
    units
  ) => {
    const resource = resources[id] || {};
    const unit = units[resource.unit] || {};

    return {
      date: getDateString(date),
      id,
      isFetchingResource,
      resource,
      unit,
    };
  }
);
