import { createSelector } from 'reselect';

import ActionTypes from 'constants/ActionTypes';
import resourceSelector from 'selectors/resourceSelector';
import dateSelector from 'selectors/dateSelector';
import isLoggedInSelector from 'selectors/isLoggedInSelector';
import requestIsActiveSelectorFactory from 'selectors/factories/requestIsActiveSelectorFactory';

const idSelector = (state) => state.router.params.id;
const unitsSelector = (state) => state.data.units;

const reservationPageSelector = createSelector(
  dateSelector,
  idSelector,
  isLoggedInSelector,
  requestIsActiveSelectorFactory(ActionTypes.API.RESOURCE_GET_REQUEST),
  resourceSelector,
  unitsSelector,
  (
    date,
    id,
    isLoggedIn,
    isFetchingResource,
    resource,
    units
  ) => {
    const unit = units[resource.unit] || {};

    return {
      date,
      id,
      isFetchingResource,
      isLoggedIn,
      resource,
      unit,
    };
  }
);

export default reservationPageSelector;
