import _ from 'lodash';
import { createSelector } from 'reselect';

import types from 'constants/ActionTypes';
import reservationDateSelector from 'selectors/reservationDateSelector';

const activeRequestsSelector = (state) => state.api.activeRequests;
const idSelector = (state) => state.router.params.id;
const resourcesSelector = (state) => state.data.resources;
const unitsSelector = (state) => state.data.units;

export const reservationPageSelectors = createSelector(
  activeRequestsSelector,
  idSelector,
  reservationDateSelector,
  resourcesSelector,
  unitsSelector,
  (
    activeRequests,
    id,
    reservationDate,
    resources,
    units
  ) => {
    const isFetchingResource = _.includes(activeRequests, types.API.RESOURCE_GET_REQUEST);
    const resource = resources[id] || {};
    const unit = units[resource.unit] || {};

    return {
      date: reservationDate,
      id,
      isFetchingResource,
      resource,
      unit,
    };
  }
);
