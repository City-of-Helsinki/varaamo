import { createSelector } from 'reselect';

import ActionTypes from 'constants/ActionTypes';
import resourceSelector from 'selectors/resourceSelector';
import requestIsActiveSelectorFactory from 'selectors/factories/requestIsActiveSelectorFactory';

const unitsSelector = (state) => state.data.units;

export const resourcePageSelectors = createSelector(
  requestIsActiveSelectorFactory(ActionTypes.API.RESOURCE_GET_REQUEST),
  resourceSelector,
  unitsSelector,
  (
    isFetchingResource,
    resource,
    units
  ) => {
    const unit = units[resource.unit] || {};

    return {
      id: resource.id,
      isFetchingResource,
      resource,
      unit,
    };
  }
);
