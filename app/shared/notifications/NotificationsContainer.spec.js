import { expect } from 'chai';
import React from 'react';
import ReactNotifications from 'react-notifications';

import { shallowWithIntl } from 'utils/testUtils';
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
    it('is rendered', () => {
      const reactNotifications = getWrapper().find(ReactNotifications);
      expect(reactNotifications.length).to.equal(1);
    });

    it('gets correct props', () => {
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
      expect(actualProps.notifications).to.deep.equal(expectedNotifications);
      expect(actualProps.onRequestHide).to.equal(defaultProps.actions.hideNotification);
    });
  });
});
