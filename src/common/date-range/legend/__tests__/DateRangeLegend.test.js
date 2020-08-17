import React from 'react';
import toJson from 'enzyme-to-json';

import DateRangeLegend from '../DateRangeLegend';
import { shallowWithIntl } from '../../../../../app/utils/testUtils';

describe('DateRangeLegend', () => {
  const getWrapper = () => shallowWithIntl(<DateRangeLegend />);

  test('renders normally', () => {
    const wrapper = getWrapper();
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
