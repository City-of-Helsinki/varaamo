import { createSelector } from 'reselect';

const userIdSelector = (state) => state.auth.userId;
const usersSelector = (state) => state.data.users;

export const appSelectors = createSelector(
  userIdSelector,
  usersSelector,
  (
    userId,
    users
  ) => {
    const user = users[userId] || {};

    return {
      user,
    };
  }
);
