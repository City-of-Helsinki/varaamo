import { createSelector } from 'reselect';

import currentUserSelector from 'selectors/currentUserSelector';
import isLoggedInSelector from 'selectors/isLoggedInSelector';

const userIdSelector = (state) => state.auth.userId;

const appSelector = createSelector(
  isLoggedInSelector,
  currentUserSelector,
  userIdSelector,
  (
    isLoggedIn,
    user,
    userId
  ) => {
    return {
      isLoggedIn,
      user,
      userId,
    };
  }
);

export default appSelector;
