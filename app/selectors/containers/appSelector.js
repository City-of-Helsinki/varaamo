import { createSelector } from 'reselect';

import isLoggedInSelector from 'selectors/isLoggedInSelector';

const userIdSelector = (state) => state.auth.userId;
const usersSelector = (state) => state.data.users;

const appSelector = createSelector(
  isLoggedInSelector,
  userIdSelector,
  usersSelector,
  (
    isLoggedIn,
    userId,
    users
  ) => {
    const user = users[userId] || {};

    return {
      isLoggedIn,
      user,
      userId,
    };
  }
);

export default appSelector;
