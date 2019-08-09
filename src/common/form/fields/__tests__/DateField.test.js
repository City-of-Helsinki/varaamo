import React from 'react';
import toJSON from 'enzyme-to-json';

import { shallowWithIntl, globalDateMock } from '../../../../../app/utils/testUtils';
import DateField from '../DateField';

describe('DateField', () => {
  test('renders correctly', () => {
    const props = {
      onChange: jest.fn(),
      label: 'foo',
      id: 'foo',
    };

    globalDateMock();
    const wrapper = shallowWithIntl(
      <DateField {...props} />
    );

    expect(toJSON(wrapper)).toMatchSnapshot();
  });
});
