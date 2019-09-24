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
 * Gotcha warning: Respa API uses isStaff flag for what Varaamo consider admin users.
 */
const isAdminSelector = createSelector(
  currentUserSelector,
  currentUser => Boolean(currentUser.isStaff)
);

function isLoggedInSelector(state) {
  return Boolean(state.auth.userId && state.auth.token);
}

const staffUnitsSelector = createSelector(
  currentUserSelector,
  (currentUser) => {
    if (!currentUser.staffPerms || !currentUser.staffPerms.unit) {
      return [];
    }
    const units = [];
    forIn(currentUser.staffPerms.unit, (value, key) => {
      if (includes(value, 'can_approve_reservation')) {
        units.push(key);
      }
    });
    return units;
  }
);

/**
 * Gotcha warning: Respa API uses isStaff boolean value for admin users.
 *
 * From Varaamo's point of view, a user is staff if they have permissions to
 * approve reservations for a resource.
 */
function createIsStaffSelector(resourceSelector) {
  return createSelector(
    resourceSelector,
    staffUnitsSelector,
    (resource, staffUnits) => includes(staffUnits, resource.unit)
  );
}

export {
  createIsStaffSelector,
  currentUserSelector,
  isAdminSelector,
  isLoggedInSelector,
  staffUnitsSelector,
};
