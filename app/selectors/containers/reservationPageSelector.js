import { createSelector } from 'reselect';

import ActionTypes from 'constants/ActionTypes';
import resourceSelector from 'selectors/resourceSelector';
import reservationDateSelector from 'selectors/reservationDateSelector';
import requestIsActiveSelectorFactory from 'selectors/factories/requestIsActiveSelectorFactory';

const unitsSelector = (state) => state.data.units;

const reservationPageSelector = createSelector(
  requestIsActiveSelectorFactory(ActionTypes.API.RESOURCE_GET_REQUEST),
  reservationDateSelector,
  resourceSelector,
  unitsSelector,
  (
    isFetchingResource,
    reservationDate,
    resource,
    units
  ) => {
    const unit = units[resource.unit] || {};

    return {
      date: reservationDate,
      id: resource.id,
      isFetchingResource,
      resource,
      unit,
    };
  }
);

export default reservationPageSelector;
