import React from 'react';
import toJSON from 'enzyme-to-json';
import moment from 'moment';

import TimeRangeFilter from '../TimeRangeFilter';
import { shallowWithIntl } from '../../../../../../app/utils/testUtils';

const defaultProps = {
  label: 'foo',
  onChange: jest.fn(),
  value: '2011-10-05T14:48:00.000Z,2011-10-05T14:48:00.000Z',
  date: '2011-10-05',
};

const findStartSelect = wrapper => wrapper.find('#time-filter-start-select');

describe('TimeRangeFilter', () => {
  const getWrapper = props => shallowWithIntl(<TimeRangeFilter {...defaultProps} {...props} />);

  test('render normally', () => {
    const wrapper = getWrapper();

    expect(toJSON(wrapper)).toMatchSnapshot();
  });

  test('should use date when building duration parameter', () => {
    const date = '2017-07-07';
    // To simplify the expect row, we are doing a bit of "filtering" the
    // actual return to ignore time parameters.
    const onChange = jest.fn((string) => {
      const [firstDate, secondDate] = string.split(',').slice(0, 2);
      const genericFirstDate = moment(firstDate).startOf('day').toISOString();
      const genericSecondDate = moment(secondDate).startOf('day').toISOString();

      return [genericFirstDate, genericSecondDate];
    });
    const wrapper = getWrapper({ date, onChange });

    findStartSelect(wrapper).prop('onChange')({ value: '12:00' });

    expect(onChange).toHaveReturnedWith([
      moment(date).startOf('day').toISOString(),
      moment(date).startOf('day').toISOString(),
    ]);
  });
});
