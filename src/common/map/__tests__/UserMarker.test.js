import React from 'react';
import { shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';

import UserMarker from '../UserMarker';

describe('UserMarker', () => {
  test('renders correctly', () => {
    const wrapper = shallow(<UserMarker position={[60.20843, 24.975634]} />);
    expect(toJSON(wrapper)).toMatchSnapshot();
  });
});
