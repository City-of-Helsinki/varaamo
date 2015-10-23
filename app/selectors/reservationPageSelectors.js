import _ from 'lodash';
import { createSelector } from 'reselect';

import types from 'constants/ActionTypes';
import { getDateString } from 'utils/TimeUtils';

const activeRequestsSelector = (state) => state.api.activeRequests;
const dateSelector = (state) => state.ui.reservation.date;
const idSelector = (state) => state.router.params.id;
const resourcesSelector = (state) => state.data.resources;
const unitsSelector = (state) => state.data.units;

export const reservationPageSelectors = createSelector(
  activeRequestsSelector,
  dateSelector,
  idSelector,
  resourcesSelector,
  unitsSelector,
  (
    activeRequests,
    date,
    id,
    resources,
    units
  ) => {
    const isFetchingResource = _.includes(activeRequests, types.API.RESOURCE_GET_REQUEST);
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
