import { createSelector } from 'reselect';

const dateSelector = (state) => state.ui.reservation.date;
const idSelector = (state) => state.router.params.id;
const resourcesSelector = (state) => state.data.resources;
const unitsSelector = (state) => state.data.units;

export const reservationPageSelectors = createSelector(
  dateSelector,
  idSelector,
  resourcesSelector,
  unitsSelector,
  (date, id, resources, units) => {
    const resource = resources[id] || {};
    return {
      date,
      id,
      resource,
      unit: units[resource.unit] || {},
    };
  }
);
