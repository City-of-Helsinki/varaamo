import { createSelector } from 'reselect';

import {
  getUnitRoleFromResource,
  getIsUnitStaff,
} from '../../../src/domain/resource/permissions/utils';

const userIdSelector = (state) => state.auth.userId;
const usersSelector = (state) => state.data.users;

const currentUserSelector = createSelector(
  userIdSelector,
  usersSelector,
  (userId, users) => users[userId] || {}
);

/**
 * Check if the user is staff and can see the private route.
 */
const isAdminSelector = createSelector(currentUserSelector, (currentUser) =>
  Boolean(currentUser.isStaff)
);

function isLoggedInSelector(state) {
  return Boolean(state.auth.userId && state.auth.token);
}

/**
 * Returns user's role in the unit the resource belongs to.
 */
function createUserUnitRoleSelector(resourceSelector) {
  return createSelector(resourceSelector, (resource) =>
    getUnitRoleFromResource(resource)
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
    createUserUnitRoleSelector(resourceSelector),
    (uiUnitRole) => getIsUnitStaff(uiUnitRole)
  );
}

export {
  createIsStaffSelector,
  currentUserSelector,
  createUserUnitRoleSelector,
  isAdminSelector,
  isLoggedInSelector,
};
