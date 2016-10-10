import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import ReactNotifications from 'react-notifications';
import simple from 'simple-mock';

import {
  UnconnectedNotificationsContainer as NotificationsContainer,
} from './NotificationsContainer';

describe('shared/notifications/NotificationsContainer', () => {
  const defaultProps = {
    actions: { hideNotification: simple.stub() },
    notifications: [{ foo: 'bar' }],
  };

  function getWrapper(props) {
    return shallow(<NotificationsContainer {...defaultProps} {...props} />);
  }

  describe('ReactNotifications component', () => {
    it('is rendered', () => {
      const reactNotifications = getWrapper().find(ReactNotifications);

      expect(reactNotifications.length).to.equal(1);
    });

    it('gets correct props', () => {
      const actualProps = getWrapper().find(ReactNotifications).props();

      expect(actualProps.notifications).to.deep.equal(defaultProps.notifications);
      expect(actualProps.onRequestHide).to.equal(defaultProps.actions.hideNotification);
    });
  });
});
