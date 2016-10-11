import { createSelector } from 'reselect';

import isLoggedInSelector from 'selectors/isLoggedInSelector';
import dateSelector from 'selectors/dateSelector';

const resourcesSelector = (state) => state.data.resources;
const resourceIdSelector = (state, props) => props.resourceId;
const unitsSelector = (state) => state.data.units;

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
  dateSelector,
  isLoggedInSelector,
  resourceSelector,
  unitSelector,
  (
    date,
    isLoggedIn,
    resource,
    unit,
  ) => ({
    date,
    isLoggedIn,
    resource,
    unit,
  })
);

export default resourceListItemSelector;
