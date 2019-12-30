import React from 'react';
import toJson from 'enzyme-to-json';
import simple from 'simple-mock';
import { shallow } from 'enzyme';

import CreateNotificationModal from '../CreateNotificationModal';
import CreateNotificationsForm from '../../form/CreateNotificationsForm';

describe('CreateNotificationsModal', () => {
  const defaultProps = {
    addElement: simple.stub(),
    save: simple.stub(),
    isOpen: false,
    onFieldChange: simple.stub(),
    onHide: simple.stub(),
    onDelete: simple.stub(),
    selectedNotification: {}
  };
  const getWrapper = props => shallow(<CreateNotificationModal {...defaultProps} {...props} />);

  test('Renders correcly', () => {
    const wrapper = getWrapper();
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  describe('Form exists', () => {
    test('form exists', () => {
      const wrapper = getWrapper();
      const form = wrapper.find(CreateNotificationsForm);
      expect(form.length).toEqual(1);
    });
  });
});
