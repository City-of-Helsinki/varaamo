import { createSelector } from 'reselect';

import currentUserSelector from 'selectors/currentUserSelector';

const isAdminSelector = createSelector(
  currentUserSelector,
  currentUser => Boolean(currentUser.isStaff)
);

export default isAdminSelector;
