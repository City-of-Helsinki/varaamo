import { createSelector } from 'reselect';

import ActionTypes from 'constants/ActionTypes';
import resourceSelector from 'selectors/resourceSelector';
import requestIsActiveSelectorFactory from 'selectors/factories/requestIsActiveSelectorFactory';

const idSelector = (state) => state.router.params.id;
const unitsSelector = (state) => state.data.units;

const resourcePageSelector = createSelector(
  idSelector,
  requestIsActiveSelectorFactory(ActionTypes.API.RESOURCE_GET_REQUEST),
  resourceSelector,
  unitsSelector,
  (
    id,
    isFetchingResource,
    resource,
    units
  ) => {
    const unit = units[resource.unit] || {};

    return {
      id,
      isFetchingResource,
      resource,
      unit,
    };
  }
);

export default resourcePageSelector;
