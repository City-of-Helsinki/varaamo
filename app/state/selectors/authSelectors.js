import { createSelector } from 'reselect';
import { get } from 'lodash';

const userIdSelector = state => state.auth.userId;
const usersSelector = state => state.data.users;

const currentUserSelector = createSelector(
  userIdSelector,
  usersSelector,
  (userId, users) => users[userId] || {},
);

/**
 * Check if the user is staff and can see the private route.
 */
const isAdminSelector = createSelector(
  currentUserSelector,
  currentUser => Boolean(currentUser.isStaff),
);

function isLoggedInSelector(state) {
  return Boolean(state.auth.userId && state.auth.token);
}

/**
 * Check if the user has admin level permissions for the resource. I.e.
 * if they are a unit admin for the resource in question.
 */
function createIsUnitAdminSelector(resourceSelector) {
  return createSelector(
    resourceSelector,
    resource => Boolean(get(resource, 'userPermissions.isAdmin', false)),
  );
}

/**
 * Check if the user has manager level permissions for the resource.
 * I.e. if they are a unit manager for the resource in question.
 */
function createIsUnitManagerSelector(resourceSelector) {
  return createSelector(
    resourceSelector,
    resource => Boolean(get(resource, 'userPermissions.isManager', false)),
  );
}

/**
 * Check if the user has manager level permissions for the resource.
 * I.e. if they are a unit manager for the resource in question.
 */
function createIsUnitViewerSelector(resourceSelector) {
  return createSelector(
    resourceSelector,
    resource => Boolean(get(resource, 'userPermissions.isViewer', false)),
  );
}

/**
 * Check if a user has admin or manager permission for a unit.
 * TODO: Find a better name for this.
 *
 * 2020/02/07
 * I added support for the manager role. According to the spec, the
 * unit manager should have the exact same permissions as the unit admin
 * has. I couldn't get a good sense of the permission management
 * architecture, but it seems like this selector is the easiest way to
 * add support for this role
 */
function createIsStaffSelector(resourceSelector) {
  return createSelector(
    createIsUnitAdminSelector(resourceSelector),
    createIsUnitManagerSelector(resourceSelector),
    (isAdmin, isManager) => isAdmin || isManager,
  );
}

export {
  createIsStaffSelector,
  createIsUnitViewerSelector,
  currentUserSelector,
  isAdminSelector,
  isLoggedInSelector,
};
