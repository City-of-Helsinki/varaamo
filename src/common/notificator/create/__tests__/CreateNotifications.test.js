import React from 'react';
import toJson from 'enzyme-to-json';
import { shallow } from 'enzyme';

import CreateNotifications from '../CreateNotifications';
import CreateNotificationsForm from '../form/CreateNotificationsForm';

describe('CreateNotifications', () => {
  const getWrapper = () => shallow(<CreateNotifications />);

  test('Snapshot test', () => {
    const wrapper = getWrapper();
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  describe('Render correct view based on state', () => {
    test('If !superuser return login screen', () => {
      const wrapper = getWrapper();
      wrapper.setState({ superuser: false, loading: false });
      const login = wrapper.find('.login');
      expect(login.length).toEqual(1);
    });

    test('If user has logged in', () => {
      const wrapper = getWrapper();
      wrapper.setState({ superuser: true, loading: false });
      const creationForm = wrapper.find(CreateNotificationsForm);
      expect(creationForm.length).toEqual(1);
    });
  });

  describe('Field changing functions work', () => {
    const wrapper = getWrapper();

    test('Test any of the fields except message', () => {
      const event = {
        target: {
          value: 'Testing name',
        },
      };
      wrapper.instance().onFieldChange(event, 'name');
      expect(wrapper.state().newNotification.name).toEqual('Testing name');
    });

    describe('Test message field with all languages', () => {
      test('Finnish', () => {
        wrapper
          .instance()
          .onFieldChange({ target: { value: 'Finland' } }, 'message', 'fi');
        expect(wrapper.state().newNotification.message.fi).toEqual('Finland');
      });

      test('Swedish', () => {
        wrapper
          .instance()
          .onFieldChange({ target: { value: 'Sweden' } }, 'message', 'sv');
        expect(wrapper.state().newNotification.message.sv).toEqual('Sweden');
      });

      test('English', () => {
        wrapper
          .instance()
          .onFieldChange({ target: { value: 'England' } }, 'message', 'en');
        expect(wrapper.state().newNotification.message.en).toEqual('England');
      });
    });
  });
});
