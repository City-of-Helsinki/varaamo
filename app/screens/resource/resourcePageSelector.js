import { createSelector } from 'reselect';

import ActionTypes from 'constants/ActionTypes';
import resourceSelector from 'selectors/resourceSelector';
import dateSelector from 'selectors/dateSelector';
import isAdminSelector from 'selectors/isAdminSelector';
import isLoggedInSelector from 'selectors/isLoggedInSelector';
import requestIsActiveSelectorFactory from 'selectors/factories/requestIsActiveSelectorFactory';

const idSelector = (state, props) => props.params.id;
const unitsSelector = (state) => state.data.units;

const resourcePageSelector = createSelector(
  dateSelector,
  idSelector,
  isAdminSelector,
  requestIsActiveSelectorFactory(ActionTypes.API.RESOURCE_GET_REQUEST),
  isLoggedInSelector,
  resourceSelector,
  unitsSelector,
  (
    date,
    id,
    isAdmin,
    isFetchingResource,
    isLoggedIn,
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

export default resourcePageSelector;
