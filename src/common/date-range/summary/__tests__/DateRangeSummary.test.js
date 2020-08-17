import React from 'react';
import toJson from 'enzyme-to-json';

import { shallowWithIntl } from '../../../../../app/utils/testUtils';
import DateRangeSummary from '../DateRangeSummary';

describe('DateRangeSummary', () => {
  const getWrapper = props => shallowWithIntl(<DateRangeSummary {...props} />);

  test('renders normally', () => {
    const wrapper = getWrapper();
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  test('renders starting and ending times correctly', () => {
    const wrapper = getWrapper({
      startDate: new Date(2020, 1, 1),
      endDate: new Date(2020, 1, 7),
    });
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
