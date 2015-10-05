import { createSelector } from 'reselect';

const idSelector = (state) => state.router.params.id;
const resourcesSelector = (state) => state.resources;
const unitsSelector = (state) => state.units;

export const resourcePageSelectors = createSelector(
  idSelector,
  resourcesSelector,
  unitsSelector,
  (id, resources, units) => {
    const resource = resources[id] || {};
    return {
      id,
      resource,
      unit: units[resource.unit] || {},
    };
  }
);
