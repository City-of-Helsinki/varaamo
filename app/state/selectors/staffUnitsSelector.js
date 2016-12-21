import includes from 'lodash/includes';
import forIn from 'lodash/forIn';
import { createSelector } from 'reselect';

import { currentUserSelector } from 'state/selectors/authSelectors';

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

export default staffUnitsSelector;
