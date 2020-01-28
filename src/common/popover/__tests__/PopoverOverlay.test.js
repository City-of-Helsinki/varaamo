import React from 'react';
import toJSON from 'enzyme-to-json';
import { shallow } from 'enzyme';

import PopoverOverlay from '../PopoverOverlay';

describe('PopoverOverlay', () => {
  test('renders correctly', () => {
    const wrapper = shallow(
      <PopoverOverlay />,
    );
    expect(toJSON(wrapper)).toMatchSnapshot();
  });
});
