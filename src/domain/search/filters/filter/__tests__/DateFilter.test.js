import React from 'react';
import toJSON from 'enzyme-to-json';

import DateFilter from '../DateFilter';
import { shallowWithIntl, globalDateMock } from '../../../../../../app/utils/testUtils';

describe('DateFilter', () => {
  test('render normally', () => {
    const props = {
      label: 'foo',
      onChange: jest.fn(),
      date: new Date(2017, 11, 10)
    };

    globalDateMock();
    const wrapper = shallowWithIntl(
      <DateFilter {...props} />
    );


    expect(toJSON(wrapper)).toMatchSnapshot();
  });
});
