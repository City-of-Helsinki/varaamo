import reject from 'lodash/collection/reject';
import { createSelector } from 'reselect';

const notificationsInputSelector = (state) => state.notifications;

const notificationsSelector = createSelector(
  notificationsInputSelector, (notifications) => {
    return {
      notifications: reject(notifications, 'hidden'),
    };
  }
);

export default notificationsSelector;
