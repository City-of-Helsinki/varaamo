import React from 'react';
import toJson from 'enzyme-to-json';
import { shallow } from 'enzyme';

import InfoLabel from '../InfoLabel';

describe('InfoLabel', () => {
  test('renders correctly', () => {
    const labelStyle = 'success';
    const labelText = 'Success';
    const wrapper = shallow(
      <InfoLabel labelStyle={labelStyle} labelText={labelText} />
    );

    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
