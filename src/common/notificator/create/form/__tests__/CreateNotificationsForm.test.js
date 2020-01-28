import React from 'react';
import toJson from 'enzyme-to-json';
import simple from 'simple-mock';
import { shallow } from 'enzyme';
import Select from 'react-select';

import CreateNotificationsForm from '../CreateNotificationsForm';

describe('CreateNotificationForm', () => {
  const defaultProps = {
    addElement: simple.stub(),
    addNew: simple.stub(),
    isEditing: false,
    newNotification: {},
    onFieldChange: simple.stub(),
  };
  const getWrapper = props => shallow(<CreateNotificationsForm {...defaultProps} {...props} />);

  test('Snapshot test', () => {
    const wrapper = getWrapper();
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  describe('Is editing or not', () => {
    test('isEditing=false', () => {
      const wrapper = getWrapper({ isEditing: false });
      const selects = wrapper.find(Select);
      expect(selects.length).toEqual(2);
    });

    test('isEditing=true', () => {
      const wrapper = getWrapper({ isEditing: true });
      const selects = wrapper.find(Select);
      expect(selects.length).toEqual(3);
    });
  });
});
