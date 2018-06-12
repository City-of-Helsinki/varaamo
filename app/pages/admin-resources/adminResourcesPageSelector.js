import includes from 'lodash/includes';
import sortBy from 'lodash/sortBy';
import uniq from 'lodash/uniq';
import moment from 'moment';
import { createSelector, createStructuredSelector } from 'reselect';

import ActionTypes from 'constants/ActionTypes';
import { isAdminSelector, isLoggedInSelector } from 'state/selectors/authSelectors';
import { resourcesSelector } from 'state/selectors/dataSelectors';
import requestIsActiveSelectorFactory from 'state/selectors/factories/requestIsActiveSelectorFactory';

const dateSelector = state => state.ui.pages.adminResources.date || moment().format('YYYY-MM-DD');
const resourceIdsSelector = state => state.ui.pages.adminResources.resourceIds;
const filteredResourceTypesSelector = state => state.ui.pages.adminResources.filteredResourceTypes;

const adminResourcesSelector = createSelector(
  resourceIdsSelector,
  resourcesSelector,
  (resourceIds, resources) => resourceIds.map(id => resources[id])
);

const adminResourceTypesSelector = createSelector(
  adminResourcesSelector,
  resources => uniq(resources.map(resource => resource.type.name))
);

const filteredAdminResourceSelector = createSelector(
  adminResourcesSelector,
  filteredResourceTypesSelector,
  (resources, filteredResourceTypes) => resources.filter(
    resource => !includes(filteredResourceTypes, resource.type.name)
  )
);

const filteredAdminResourcesIdsSelector = createSelector(
  filteredAdminResourceSelector,
  resources => sortBy(resources, 'name').map(res => res.id),
);

const adminResourcesPageSelector = createStructuredSelector({
  date: dateSelector,
  filteredResourceTypes: filteredResourceTypesSelector,
  isAdmin: isAdminSelector,
  isLoggedin: isLoggedInSelector,
  isFetchingResources: requestIsActiveSelectorFactory(ActionTypes.API.RESOURCES_GET_REQUEST),
  resources: filteredAdminResourcesIdsSelector,
  resourceTypes: adminResourceTypesSelector,
});

export default adminResourcesPageSelector;
