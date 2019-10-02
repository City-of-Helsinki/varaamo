import forIn from 'lodash/forIn';
import includes from 'lodash/includes';
import { createSelector } from 'reselect';

const userIdSelector = state => state.auth.userId;
const usersSelector = state => state.data.users;

const currentUserSelector = createSelector(
  userIdSelector,
  usersSelector,
  (userId, users) => users[userId] || {}
);

/**
 * Check if the user is staff and can see the private route.
 */
const isAdminSelector = createSelector(
  currentUserSelector,
  currentUser => Boolean(currentUser.isStaff)
);

function isLoggedInSelector(state) {
  return Boolean(state.auth.userId && state.auth.token);
}

/**
 * Check if a user has admin permission for a unit.
 * TODO: Find a better name for this.
 */
function createIsStaffSelector(resourceSelector) {
  return createSelector(
    resourceSelector,
    resource => Boolean(resource && resource.userPermissions && resource.userPermissions.isAdmin)
  );
}

export {
  createIsStaffSelector,
  currentUserSelector,
  isAdminSelector,
  isLoggedInSelector,
};
