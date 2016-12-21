import { createSelector, createStructuredSelector } from 'reselect';

import { resourcesSelector, unitsSelector } from 'state/selectors/dataSelectors';
import isLoggedInSelector from 'state/selectors/isLoggedInSelector';

const resourceIdSelector = (state, props) => props.resourceId;

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

const resourceListItemSelector = createStructuredSelector({
  isLoggedIn: isLoggedInSelector,
  resource: resourceSelector,
  unit: unitSelector,
});

export default resourceListItemSelector;
