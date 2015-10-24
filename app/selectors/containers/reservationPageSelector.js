import { createSelector } from 'reselect';

import ActionTypes from 'constants/ActionTypes';
import resourceSelector from 'selectors/resourceSelector';
import reservationDateSelector from 'selectors/reservationDateSelector';
import requestIsActiveSelectorFactory from 'selectors/factories/requestIsActiveSelectorFactory';

const idSelector = (state) => state.router.params.id;
const unitsSelector = (state) => state.data.units;

const reservationPageSelector = createSelector(
  idSelector,
  requestIsActiveSelectorFactory(ActionTypes.API.RESOURCE_GET_REQUEST),
  reservationDateSelector,
  resourceSelector,
  unitsSelector,
  (
    id,
    isFetchingResource,
    reservationDate,
    resource,
    units
  ) => {
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

export default reservationPageSelector;
