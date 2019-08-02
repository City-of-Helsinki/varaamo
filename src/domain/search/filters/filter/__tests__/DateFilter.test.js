import React from 'react';
import toJSON from 'enzyme-to-json';

import DateFilter from '../DateFilter';
import { shallowWithIntl } from '../../../../../../app/utils/testUtils';


describe('DateFilter', () => {
  test('render normally', () => {
    const props = {
      label: 'foo',
      onChange: jest.fn()
    };
    const wrapper = shallowWithIntl(
      <DateFilter {...props} />
    );

    expect(toJSON(wrapper)).toMatchSnapshot();
  });
});
