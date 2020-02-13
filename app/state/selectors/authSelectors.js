import { createSelector } from 'reselect';
import { get } from 'lodash';

import { roleMapper } from '../../../src/domain/resource/permissions/utils';

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
 * Returns user's role in unit.
 */
function createUserUnitRoleSelector(resourceSelector) {
  return createSelector(
    createIsUnitAdminSelector(resourceSelector),
    createIsUnitManagerSelector(resourceSelector),
    createIsUnitViewerSelector(resourceSelector),
    (isUnitAdmin, isUnitManager, isUnitViewer) => roleMapper(isUnitAdmin, isUnitManager, isUnitViewer),
  );
}

/**
 * Check if the user is either admin, manager or viewer in the unit the
 * resource belongs to.
 *
 * For more fine grained control, use the hasPermissionForResource
 * utility function.
 */
function createIsStaffSelector(resourceSelector) {
  return createSelector(
    createIsUnitAdminSelector(resourceSelector),
    createIsUnitManagerSelector(resourceSelector),
    createIsUnitViewerSelector(resourceSelector),
    (isUnitAdmin, isUnitManager, isUnitViewer) => isUnitAdmin || isUnitManager || isUnitViewer,
  );
}

export {
  createIsStaffSelector,
  currentUserSelector,
  createUserUnitRoleSelector,
  isAdminSelector,
  isLoggedInSelector,
};
