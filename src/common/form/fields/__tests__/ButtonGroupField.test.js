import React from 'react';
import toJSON from 'enzyme-to-json';
import { shallow } from 'enzyme';

import ButtonGroupField from '../ButtonGroupField';

describe('ButtonGroupField', () => {
  test('renders correctly', () => {
    const props = {
      onChange: jest.fn(),
      label: 'foo',
      options: [
        { value: 'foo', label: 'Foo' },
        { value: 'bar', label: 'Bar' },
      ],
      value: 'foo',
      type: 'checkbox',
      id: 'foo',
    };

    const wrapper = shallow(
      <ButtonGroupField {...props} />
    );

    expect(toJSON(wrapper)).toMatchSnapshot();
  });
});
