import { createSelector } from 'reselect';
import pick from 'lodash/pick';
import sortBy from 'lodash/sortBy';
import values from 'lodash/values';

import ActionTypes from 'constants/ActionTypes';
import requestIsActiveSelectorFactory from 'state/selectors/factories/requestIsActiveSelectorFactory';
import isAdminSelector from 'state/selectors/isAdminSelector';

const resourcesSelector = state => state.data.resources;
const resourceIdsSelector = state => state.ui.pages.adminResources.resourceIds;

const adminResourcesPageSelector = createSelector(
  isAdminSelector,
  requestIsActiveSelectorFactory(ActionTypes.API.RESOURCES_GET_REQUEST),
  resourceIdsSelector,
  resourcesSelector,
  (
    isAdmin,
    isFetchingResources,
    resourceIds,
    resources
  ) => ({
    isAdmin,
    isFetchingResources,
    resources: sortBy(values(pick(resources, resourceIds)), resource => resource.name.fi),
  })
);

export default adminResourcesPageSelector;
