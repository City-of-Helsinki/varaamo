import { createSelector, createStructuredSelector } from 'reselect';

import FontSizes from '../../constants/FontSizes';
import { isLoggedInSelector } from '../../state/selectors/authSelectors';
import { createResourceSelector, unitsSelector } from '../../state/selectors/dataSelectors';

const resourceIdSelector = (state, props) => props.resourceId;
const resourceSelector = createResourceSelector(resourceIdSelector);
const unitSelector = createSelector(
  unitsSelector,
  resourceSelector,
  (units, resource) => units[resource.unit] || {},
);
const isNormalFontSizeSelector = state => state.ui.accessibility.fontSize !== FontSizes.LARGE;

const ResourceCardSelector = createStructuredSelector({
  isLoggedIn: isLoggedInSelector,
  resource: createResourceSelector(resourceIdSelector),
  unit: unitSelector,
  isNormalFontSize: isNormalFontSizeSelector,
});

export default ResourceCardSelector;
