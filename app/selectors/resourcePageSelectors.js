import { createSelector } from 'reselect';

const idSelector = (state) => state.router.params.id;
const isFetchingResourceSelector = (state) => state.api.isFetchingResource;
const resourcesSelector = (state) => state.data.resources;
const unitsSelector = (state) => state.data.units;

export const resourcePageSelectors = createSelector(
  idSelector,
  isFetchingResourceSelector,
  resourcesSelector,
  unitsSelector,
  (
    id,
    isFetchingResource,
    resources,
    units
  ) => {
    const resource = resources[id] || {};
    const unit = units[resource.unit] || {};

    return {
      id,
      isFetchingResource,
      resource,
      unit,
    };
  }
);
