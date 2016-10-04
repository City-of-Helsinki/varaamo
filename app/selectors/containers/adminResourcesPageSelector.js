import { createSelector } from 'reselect';
import pick from 'lodash/pick';
import values from 'lodash/values';
import sortBy from 'lodash/sortBy';

import ActionTypes from 'constants/ActionTypes';
import requestIsActiveSelectorFactory from 'selectors/factories/requestIsActiveSelectorFactory';
import isAdminSelector from 'selectors/isAdminSelector';

const resourcesSelector = (state) => state.data.resources;
const resourceIdsSelector = (state) => state.ui.pages.adminResources.resourceIds;

const adminResourcesPage = createSelector(
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
    resources: sortBy(values(pick(resources, resourceIds)), (resource) => resource.name.fi),
  })
);

export default adminResourcesPage;
