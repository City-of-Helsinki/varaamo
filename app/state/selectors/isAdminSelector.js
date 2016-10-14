import { createSelector } from 'reselect';

import currentUserSelector from 'state/selectors/currentUserSelector';

const isAdminSelector = createSelector(
  currentUserSelector,
  currentUser => Boolean(currentUser.isStaff)
);

export default isAdminSelector;
