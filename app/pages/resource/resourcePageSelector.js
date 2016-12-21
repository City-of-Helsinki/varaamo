import { createSelector, createStructuredSelector } from 'reselect';

import ActionTypes from 'constants/ActionTypes';
import resourceSelector from 'state/selectors/resourceSelector';
import dateSelector from 'state/selectors/dateSelector';
import isAdminSelector from 'state/selectors/isAdminSelector';
import isLoggedInSelector from 'state/selectors/isLoggedInSelector';
import requestIsActiveSelectorFactory from 'state/selectors/factories/requestIsActiveSelectorFactory';
import { unitsSelector } from 'state/selectors/dataSelectors';

const idSelector = (state, props) => props.params.id;

const unitSelector = createSelector(
  resourceSelector,
  unitsSelector,
  (resource, units) => units[resource.unit] || {}
);

const resourcePageSelector = createStructuredSelector({
  date: dateSelector,
  id: idSelector,
  isAdmin: isAdminSelector,
  isFetchingResource: requestIsActiveSelectorFactory(ActionTypes.API.RESOURCE_GET_REQUEST),
  isLoggedIn: isLoggedInSelector,
  resource: resourceSelector,
  unit: unitSelector,
});

export default resourcePageSelector;
