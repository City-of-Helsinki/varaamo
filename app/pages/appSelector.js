import { createSelector } from 'reselect';

import currentUserSelector from 'selectors/currentUserSelector';
import isAdminSelector from 'selectors/isAdminSelector';
import isLoggedInSelector from 'selectors/isLoggedInSelector';

const userIdSelector = (state) => state.auth.userId;

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
