import some from 'lodash/some';
import { createSelector } from 'reselect';

const resourcesSelector = (state) => state.data.resources;

const isAdminSelector = createSelector(
  resourcesSelector,
  (resources) => {
    return some(resources, (resource) => resource.userPermissions.isAdmin);
  }
);

export default isAdminSelector;
