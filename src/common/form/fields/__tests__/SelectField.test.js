import React from 'react';
import toJSON from 'enzyme-to-json';

import { shallowWithIntl } from '../../../../../app/utils/testUtils';
import SelectField from '../SelectField';

describe('SelectField', () => {
  test('renders correctly', () => {
    const props = {
      onChange: jest.fn(),
      label: 'foo',
      options: [
        { value: 'foo', label: 'Foo' },
        { value: 'bar', label: 'Bar' },
      ],
      value: 'foo',
      id: 'foo',
    };

    const wrapper = shallowWithIntl(
      <SelectField {...props} />,
    );

    expect(toJSON(wrapper)).toMatchSnapshot();
  });
});
