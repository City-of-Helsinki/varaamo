import React from 'react';
import toJSON from 'enzyme-to-json';
import { shallow } from 'enzyme';

import ManageReservationsDropdown from '../ManageReservationsDropdown';

describe('ManageReservationsDropdown', () => {
  test('renders correctly', () => {
    const wrapper = shallow(
      <ManageReservationsDropdown />
    );
    expect(toJSON(wrapper)).toMatchSnapshot();
  });
});
