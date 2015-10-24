import { createSelector } from 'reselect';

import ActionTypes from 'constants/ActionTypes';
import reservationDateSelector from 'selectors/reservationDateSelector';
import requestIsActiveSelectorFactory from 'selectors/factories/requestIsActiveSelectorFactory';

const idSelector = (state) => state.router.params.id;
const resourcesSelector = (state) => state.data.resources;
const unitsSelector = (state) => state.data.units;

export const reservationPageSelectors = createSelector(
  idSelector,
  requestIsActiveSelectorFactory(ActionTypes.API.RESOURCE_GET_REQUEST),
  reservationDateSelector,
  resourcesSelector,
  unitsSelector,
  (
    id,
    isFetchingResource,
    reservationDate,
    resources,
    units
  ) => {
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
