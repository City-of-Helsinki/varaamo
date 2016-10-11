import { createSelector } from 'reselect';

const userIdSelector = state => state.auth.userId;
const usersSelector = state => state.data.users;

const currentUserSelector = createSelector(
  userIdSelector,
  usersSelector,
  (userId, users) => users[userId] || {}
);

export default currentUserSelector;
