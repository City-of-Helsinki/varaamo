import { createSelector } from 'reselect';

import ActionTypes from 'constants/ActionTypes';
import resourceSelector from 'selectors/resourceSelector';
import dateSelector from 'selectors/dateSelector';
import isAdminSelector from 'selectors/isAdminSelector';
import isLoggedInSelector from 'selectors/isLoggedInSelector';
import requestIsActiveSelectorFactory from 'selectors/factories/requestIsActiveSelectorFactory';

const idSelector = (state, props) => props.params.id;
const unitsSelector = (state) => state.data.units;

const reservationPageSelector = createSelector(
  dateSelector,
  idSelector,
  isAdminSelector,
  isLoggedInSelector,
  requestIsActiveSelectorFactory(ActionTypes.API.RESOURCE_GET_REQUEST),
  resourceSelector,
  unitsSelector,
  (
    date,
    id,
    isAdmin,
    isLoggedIn,
    isFetchingResource,
    resource,
    units
  ) => {
    const unit = units[resource.unit] || {};

    return {
      date,
      id,
      isAdmin,
      isFetchingResource,
      isLoggedIn,
      resource,
      unit,
    };
  }
);

export default reservationPageSelector;
