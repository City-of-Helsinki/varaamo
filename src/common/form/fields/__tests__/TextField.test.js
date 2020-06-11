import React from 'react';
import toJSON from 'enzyme-to-json';

import { shallowWithIntl } from '../../../../../app/utils/testUtils';
import TextField from '../TextField';

describe('ButtonGroupField', () => {
  test('renders correctly', () => {
    const props = {
      onChange: jest.fn(),
      label: 'foo',
      value: 'foo',
      id: 'foo',
    };

    const wrapper = shallowWithIntl(<TextField {...props} />);

    expect(toJSON(wrapper)).toMatchSnapshot();
  });
});
