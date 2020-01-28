import React from 'react';
import toJSON from 'enzyme-to-json';

import TextFilter from '../TextFilter';
import { shallowWithIntl } from '../../../../../../app/utils/testUtils';


describe('TextFilter', () => {
  test('render normally', () => {
    const props = {
      id: 'foo',
      onChange: jest.fn(),
      onSearch: jest.fn(),
      value: 'bar',
    };
    const wrapper = shallowWithIntl(
      <TextFilter {...props} />,
    );

    expect(toJSON(wrapper)).toMatchSnapshot();
  });
});
