import { createSelector, createStructuredSelector } from 'reselect';

import { createResourceSelector, unitsSelector } from 'state/selectors/dataSelectors';
import isLoggedInSelector from 'state/selectors/isLoggedInSelector';

const resourceIdSelector = (state, props) => props.resourceId;
const resourceSelector = createResourceSelector(resourceIdSelector);
const unitSelector = createSelector(
  unitsSelector,
  resourceSelector,
  (units, resource) => units[resource.unit] || {}
);

const resourceListItemSelector = createStructuredSelector({
  isLoggedIn: isLoggedInSelector,
  resource: createResourceSelector(resourceIdSelector),
  unit: unitSelector,
});

export default resourceListItemSelector;
