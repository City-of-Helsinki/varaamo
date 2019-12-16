import React from 'react';
import { shallow } from 'enzyme';

import UserNotificator from '../UserNotificator';

describe('UserNotificator', () => {
  const defaultProps = {
    isStaff: false,
    language: '',
  };

  const getWrapper = props => shallow(<UserNotificator {...defaultProps} {...props} />);

  describe('Returns correct notification', () => {
    test('If notification array has target=all, return that', () => {
      const notifications = [
        { target: 'all', message: { fi: '', en: 'Message for all', sv: '' }, urgency: 'common' },
        { target: 'staff', message: { fi: '', en: 'Message for staff', sv: '' }, urgency: 'common' },
        { target: 'user', message: { fi: '', en: 'Message for user', sv: '' }, urgency: 'common' }
      ];

      const wrapper = getWrapper();
      wrapper.setState({ notifications });
      const notification = wrapper.instance().selectNotificationToShow();
      expect(notification.message.en).toEqual('Message for all');
    });

    const notifications = [
      { target: 'staff', message: { fi: '', en: 'Message for staff', sv: '' }, urgency: 'common' },
      { target: 'user', message: { fi: '', en: 'Message for user', sv: '' }, urgency: 'common' }
    ];

    test('No target=all and user is not admin', () => {
      const wrapper = getWrapper();
      wrapper.setState({ notifications });
      const notification = wrapper.instance().selectNotificationToShow();
      expect(notification.message.en).toEqual('Message for user');
    });

    test('No target=all and user is admin', () => {
      const userIsStaff = {
        isStaff: true
      };
      const wrapper = getWrapper(userIsStaff);
      wrapper.setState({ notifications });
      const notification = wrapper.instance().selectNotificationToShow();
      expect(notification.message.en).toEqual('Message for staff');
    });
  });

  describe('Render correct className based on urgency', () => {
    const wrapper = getWrapper();

    test('Common', () => {
      wrapper.setState({
        notifications: [
          {
            target: 'user',
            message: { fi: '', en: 'Message for user', sv: '' },
            urgency: 'common'
          }
        ]
      });
      expect(wrapper.exists('.app-UserNotificator')).toEqual(true);
    });

    test('Warning', () => {
      wrapper.setState({
        notifications: [
          {
            target: 'user',
            message: { fi: '', en: 'Message for user', sv: '' },
            urgency: 'warning'
          }
        ]
      });
      expect(wrapper.exists('.app-UserNotificator__warning')).toEqual(true);
    });

    test('Danger', () => {
      wrapper.setState({
        notifications: [
          {
            target: 'user',
            message: { fi: '', en: 'Message for user', sv: '' },
            urgency: 'danger'
          }
        ]
      });
      expect(wrapper.exists('.app-UserNotificator__danger')).toEqual(true);
    });
  });

  describe('Use correct language', () => {
    const notifications = [
      // eslint-disable-next-line max-len
      { target: 'user', message: { fi: 'Viesti käyttäjälle', en: 'Message for user', sv: 'Meddelande för användaren' }, urgency: 'common' }
    ];

    test('Language is fi', () => {
      const wrapper = getWrapper({ language: 'fi' });
      wrapper.setState({ notifications });
      const languageText = wrapper.find('.notification-message');
      expect(languageText.text()).toEqual('Viesti käyttäjälle');
    });

    test('Language is en', () => {
      const wrapper = getWrapper({ language: 'en' });
      wrapper.setState({ notifications });
      const languageText = wrapper.find('.notification-message');
      expect(languageText.text()).toEqual('Message for user');
    });

    test('Language is sv', () => {
      const wrapper = getWrapper({ language: 'sv' });
      wrapper.setState({ notifications });
      const languageText = wrapper.find('.notification-message');
      expect(languageText.text()).toEqual('Meddelande för användaren');
    });

    test('Language is en but no message in finnish', () => {
      const noLanguageNotifications = [
        { target: 'user', message: { fi: 'Viesti käyttäjälle', en: '', sv: '' }, urgency: 'common' }
      ];
      const noLanguageWrapper = getWrapper({ language: 'en' });
      noLanguageWrapper.setState({ notifications: noLanguageNotifications });
      const languageText = noLanguageWrapper.find('.notification-message');
      expect(languageText.text()).toEqual('Viesti käyttäjälle');
    });
  });
});
