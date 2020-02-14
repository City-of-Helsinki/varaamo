import React from 'react';
import toJSON from 'enzyme-to-json';

import TimeRangeFilter from '../TimeRangeFilter';
import { shallowWithIntl } from '../../../../../../app/utils/testUtils';

const defaultProps = {
  label: 'foo',
  onChange: jest.fn(),
  value: '12:48,14:48',
  date: '2011-10-05',
};

const findStartSelect = wrapper => wrapper.find('#time-filter-start-select');
const findEndSelect = wrapper => wrapper.find('#time-filter-end-select');
const findDurationSelect = wrapper => wrapper.find('#time-filter-duration-select');

describe('TimeRangeFilter', () => {
  const getWrapper = props => shallowWithIntl(<TimeRangeFilter {...defaultProps} {...props} />);

  test('render normally', () => {
    const wrapper = getWrapper();

    expect(toJSON(wrapper)).toMatchSnapshot();
  });

  test('should parse value string into values correctly', () => {
    const startTime = '12:00';
    const endTime = '14:00';
    const duration = 30;
    const value = [
      startTime,
      endTime,
      duration,
    ].join(',');
    const wrapper = getWrapper({ value });

    expect(findStartSelect(wrapper).prop('value')).toEqual(startTime);
    expect(findEndSelect(wrapper).prop('value')).toEqual(endTime);
    expect(findDurationSelect(wrapper).prop('value')).toEqual(duration);
  });

  test('should send time values without date information', () => {
    const startTime = '12:00';
    const endTime = '14:00';
    const duration = 30;
    const onChange = jest.fn(value => value);
    const wrapper = getWrapper({ onChange });

    findStartSelect(wrapper).prop('onChange')({ value: startTime });
    findEndSelect(wrapper).prop('onChange')({ value: endTime });
    findDurationSelect(wrapper).prop('onChange')({ value: duration });

    expect(onChange).toHaveLastReturnedWith([
      startTime,
      endTime,
      duration,
    ].join(','));
  });
});
