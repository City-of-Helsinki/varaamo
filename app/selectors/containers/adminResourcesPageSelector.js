import { createSelector } from 'reselect';
import pick from 'lodash/pick';
import values from 'lodash/values';

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
    resources: values(pick(resources, resourceIds)),
  })
);

export default adminResourcesPage;
