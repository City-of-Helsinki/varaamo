import React from 'react';
import toJSON from 'enzyme-to-json';

import TimeRangeFilter from '../TimeRangeFilter';
import { shallowWithIntl } from '../../../../../../app/utils/testUtils';


describe('TimeRangeFilter', () => {
  test('render normally', () => {
    const props = {
      label: 'foo',
      onChange: jest.fn(),
      value: '2011-10-05T14:48:00.000Z,2011-10-05T14:48:00.000Z'
    };
    const wrapper = shallowWithIntl(
      <TimeRangeFilter {...props} />
    );

    expect(toJSON(wrapper)).toMatchSnapshot();
  });
});
