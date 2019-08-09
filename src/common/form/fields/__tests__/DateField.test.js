import React from 'react';
import toJSON from 'enzyme-to-json';

import { shallowWithIntl, globalDateMock } from '../../../../../app/utils/testUtils';
import DateField from '../DateField';

describe('DateField', () => {
  globalDateMock();

  test('renders correctly', () => {
    const props = {
      onChange: jest.fn(),
      label: 'foo',
      id: 'foo',
      value: new Date(),
    };

    const wrapper = shallowWithIntl(
      <DateField {...props} />
    );

    expect(toJSON(wrapper)).toMatchSnapshot();
  });
});
