import sortBy from 'lodash/sortBy';
import moment from 'moment';
import { createSelector, createStructuredSelector } from 'reselect';

import ActionTypes from 'constants/ActionTypes';
import { isAdminSelector } from 'state/selectors/authSelectors';
import { resourcesSelector } from 'state/selectors/dataSelectors';
import requestIsActiveSelectorFactory from 'state/selectors/factories/requestIsActiveSelectorFactory';

const dateSelector = state => state.ui.pages.adminResources.date || moment().format('YYYY-MM-DD');
const resourceIdsSelector = state => state.ui.pages.adminResources.resourceIds;

const adminResourcesSelector = createSelector(
  resourceIdsSelector,
  resourcesSelector,
  (resourceIds, resources) => sortBy(resourceIds.map(id => resources[id]), 'name').map(res => res.id),
);

const adminResourcesPageSelector = createStructuredSelector({
  date: dateSelector,
  isAdmin: isAdminSelector,
  isFetchingResources: requestIsActiveSelectorFactory(ActionTypes.API.RESOURCES_GET_REQUEST),
  resources: adminResourcesSelector,
});

export default adminResourcesPageSelector;
