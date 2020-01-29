import React from 'react';
import toJSON from 'enzyme-to-json';
import { shallow } from 'enzyme';

import { globalDateMock } from '../../../../../app/utils/testUtils';
import { UntranslatedDateField as DateField } from '../DateField';

describe('DateField', () => {
  test('renders correctly', () => {
    const props = {
      onChange: jest.fn(),
      label: 'foo',
      id: 'foo',
      value: new Date(2019, 8, 9),
      locale: 'en',
    };

    globalDateMock();

    const wrapper = shallow(
      <DateField {...props} />,
    );

    expect(toJSON(wrapper)).toMatchSnapshot();
  });
});
