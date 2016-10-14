import { createSelector } from 'reselect';

import ActionTypes from 'constants/ActionTypes';
import resourceSelector from 'state/selectors/resourceSelector';
import dateSelector from 'state/selectors/dateSelector';
import isAdminSelector from 'state/selectors/isAdminSelector';
import isLoggedInSelector from 'state/selectors/isLoggedInSelector';
import requestIsActiveSelectorFactory from 'state/selectors/factories/requestIsActiveSelectorFactory';

const idSelector = (state, props) => props.params.id;
const unitsSelector = state => state.data.units;

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
