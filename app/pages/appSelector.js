import { createSelector } from 'reselect';

import currentUserSelector from 'state/selectors/currentUserSelector';
import isAdminSelector from 'state/selectors/isAdminSelector';
import isLoggedInSelector from 'state/selectors/isLoggedInSelector';

const userIdSelector = state => state.auth.userId;

const appSelector = createSelector(
  isAdminSelector,
  isLoggedInSelector,
  currentUserSelector,
  userIdSelector,
  (
    isAdmin,
    isLoggedIn,
    user,
    userId
  ) => ({
    isAdmin,
    isLoggedIn,
    user,
    userId,
  })
);

export default appSelector;
