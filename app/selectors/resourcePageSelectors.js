import _ from 'lodash';
import { createSelector } from 'reselect';

import types from 'constants/ActionTypes';

const activeRequestsSelector = (state) => state.api.activeRequests;
const idSelector = (state) => state.router.params.id;
const resourcesSelector = (state) => state.data.resources;
const unitsSelector = (state) => state.data.units;

export const resourcePageSelectors = createSelector(
  activeRequestsSelector,
  idSelector,
  resourcesSelector,
  unitsSelector,
  (
    activeRequests,
    id,
    resources,
    units
  ) => {
    const isFetchingResource = _.includes(activeRequests, types.API.RESOURCE_GET_REQUEST);
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
