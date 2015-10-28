import { createSelector } from 'reselect';

import ActionTypes from 'constants/ActionTypes';
import resourceSelector from 'selectors/resourceSelector';
import dateSelector from 'selectors/dateSelector';
import requestIsActiveSelectorFactory from 'selectors/factories/requestIsActiveSelectorFactory';

const idSelector = (state) => state.router.params.id;
const unitsSelector = (state) => state.data.units;

const reservationPageSelector = createSelector(
  idSelector,
  requestIsActiveSelectorFactory(ActionTypes.API.RESOURCE_GET_REQUEST),
  dateSelector,
  resourceSelector,
  unitsSelector,
  (
    id,
    isFetchingResource,
    date,
    resource,
    units
  ) => {
    const unit = units[resource.unit] || {};

    return {
      date,
      id,
      isFetchingResource,
      resource,
      unit,
    };
  }
);

export default reservationPageSelector;
