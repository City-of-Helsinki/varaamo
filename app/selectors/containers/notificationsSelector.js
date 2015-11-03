import _ from 'lodash';
import { createSelector } from 'reselect';

const notificationsInputSelector = (state) => state.notifications;

const notificationsSelector = createSelector(
  notificationsInputSelector, (notifications) => {
    return {
      notifications: _.reject(notifications, 'hidden'),
    };
  }
);

export default notificationsSelector;
