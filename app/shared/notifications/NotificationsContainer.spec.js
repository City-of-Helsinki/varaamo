import React from 'react';
import ReactNotifications from 'react-notifications';

import { shallowWithIntl } from '../../utils/testUtils';
import {
  UnconnectedNotificationsContainer as NotificationsContainer,
} from './NotificationsContainer';

describe('shared/notifications/NotificationsContainer', () => {
  const defaultProps = {
    actions: { hideNotification: () => null },
    notifications: [],
  };

  function getWrapper(props) {
    return shallowWithIntl(<NotificationsContainer {...defaultProps} {...props} />);
  }

  describe('ReactNotifications component', () => {
    test('is rendered', () => {
      const reactNotifications = getWrapper().find(ReactNotifications);
      expect(reactNotifications.length).toBe(1);
    });

    test('gets correct props', () => {
      const notifications = [
        { message: 'Some message', type: 'success' },
        { messageId: 'Notifications.errorMessage', type: 'error' },
      ];
      const expectedNotifications = [
        {
          message: 'Some message',
          type: 'success',
        },
        {
          message: 'Notifications.errorMessage',
          messageId: 'Notifications.errorMessage',
          type: 'error',
        },
      ];
      const actualProps = getWrapper({ notifications }).find(ReactNotifications).props();
      expect(actualProps.notifications).toEqual(expectedNotifications);
      expect(actualProps.onRequestHide).toBe(defaultProps.actions.hideNotification);
    });
  });
});
