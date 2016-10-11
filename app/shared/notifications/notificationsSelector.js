import reject from 'lodash/reject';
import { createSelector } from 'reselect';

const notificationsInputSelector = state => state.notifications;

const notificationsSelector = createSelector(
  notificationsInputSelector, notifications => ({
    notifications: reject(notifications, 'hidden'),
  })
);

export default notificationsSelector;
