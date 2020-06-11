import React from 'react';
import toJSON from 'enzyme-to-json';
import { shallow } from 'enzyme';

import ManageReservationsComment from '../ManageReservationsComment';

describe('ManageReservationsComment', () => {
  test('renders correctly', () => {
    const wrapper = shallow(<ManageReservationsComment comments="foo" />);
    expect(toJSON(wrapper)).toMatchSnapshot();
  });
});
