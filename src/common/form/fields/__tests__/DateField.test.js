import React from 'react';
import toJSON from 'enzyme-to-json';

import { shallowWithIntl } from '../../../../../app/utils/testUtils';
import DateField from '../DateField';

describe('DateField', () => {
  test('renders correctly', () => {
    const props = {
      onChange: jest.fn(),
      label: 'foo',
      id: 'foo',
    };

    const wrapper = shallowWithIntl(
      <DateField {...props} />
    );

    expect(toJSON(wrapper)).toMatchSnapshot();
  });
});
