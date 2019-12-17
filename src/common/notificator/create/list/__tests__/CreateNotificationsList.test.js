import React from 'react';
import toJson from 'enzyme-to-json';
import simple from 'simple-mock';
import { shallow } from 'enzyme';

import CreateNotificationsList from '../CreateNotificationsList';

describe('CreateNotificationList', () => {
  const defaultProps = {
    notifications: [],
    onClick: simple.stub()
  };
  const getWrapper = props => shallow(<CreateNotificationsList {...defaultProps} {...props} />);

  test('Renders correctly', () => {
    const wrapper = getWrapper();
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
