import { createSelector } from 'reselect';

import isLoggedInSelector from 'state/selectors/isLoggedInSelector';

const resourcesSelector = state => state.data.resources;
const resourceIdSelector = (state, props) => props.resourceId;
const unitsSelector = state => state.data.units;

const resourceSelector = createSelector(
  resourcesSelector,
  resourceIdSelector,
  (resources, resourceId) => resources[resourceId] || {}
);

const unitSelector = createSelector(
  unitsSelector,
  resourceSelector,
  (units, resource) => units[resource.unit] || {}
);

const resourceListItemSelector = createSelector(
  isLoggedInSelector,
  resourceSelector,
  unitSelector,
  (
    isLoggedIn,
    resource,
    unit,
  ) => ({
    isLoggedIn,
    resource,
    unit,
  })
);

export default resourceListItemSelector;
