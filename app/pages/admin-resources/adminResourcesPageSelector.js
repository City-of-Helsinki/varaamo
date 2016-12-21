import { createSelector, createStructuredSelector } from 'reselect';
import sortBy from 'lodash/sortBy';

import ActionTypes from 'constants/ActionTypes';
import { resourcesSelector } from 'state/selectors/dataSelectors';
import requestIsActiveSelectorFactory from 'state/selectors/factories/requestIsActiveSelectorFactory';
import isAdminSelector from 'state/selectors/isAdminSelector';

const resourceIdsSelector = state => state.ui.pages.adminResources.resourceIds;

const adminResourcesSelector = createSelector(
  resourceIdsSelector,
  resourcesSelector,
  (resourceIds, resources) => (
    sortBy(resourceIds.map(id => resources[id]), 'name')
  )
);

const adminResourcesPageSelector = createStructuredSelector({
  isAdmin: isAdminSelector,
  isFetchingResources: requestIsActiveSelectorFactory(ActionTypes.API.RESOURCES_GET_REQUEST),
  resources: adminResourcesSelector,
});

export default adminResourcesPageSelector;
