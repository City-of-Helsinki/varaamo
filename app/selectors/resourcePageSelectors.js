import { createSelector } from 'reselect';

import ActionTypes from 'constants/ActionTypes';
import requestIsActiveSelectorFactory from 'selectors/factories/requestIsActiveSelectorFactory';

const idSelector = (state) => state.router.params.id;
const resourcesSelector = (state) => state.data.resources;
const unitsSelector = (state) => state.data.units;

export const resourcePageSelectors = createSelector(
  idSelector,
  requestIsActiveSelectorFactory(ActionTypes.API.RESOURCE_GET_REQUEST),
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
