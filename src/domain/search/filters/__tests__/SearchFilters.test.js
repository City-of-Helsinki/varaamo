import React from 'react';
import toJSON from 'enzyme-to-json';

import { ISearchFilters } from '../SearchFilters';
import { shallowWithIntl } from '../../../../../app/utils/testUtils';
import unit from '../../../../common/data/fixtures/unit';
import purpose from '../../../../common/data/fixtures/purpose';
import DateFilter from '../filter/DateFilter';
import TimeRangeFilter from '../filter/TimeRangeFilter';

const defaultProps = {
  onChange: jest.fn(),
  onGeolocationToggle: jest.fn(),
  units: [unit.build()],
  purposes: [purpose.build()],
  filters: {},
  t: value => value,
};
const findDateFilter = wrapper => wrapper.find(DateFilter);
const findTimeRangeFilter = wrapper => wrapper.find(TimeRangeFilter);
// This selector breaks easily
const findSubmitButton = wrapper => wrapper.find({ children: 'SearchFilters.searchButton' });
const makeDatetime = (dateVal, timeVal) => `${dateVal}T${timeVal}`;
const availableBetweenFilter = value => value.availableBetween;

const startTime = '11:00';
const endTime = '13:00';
const duration = 30;
const datetimeRange = (date0, date1) => [`${date0}T${startTime}`, `${date1 || date0}T${endTime}`, 30];

describe('ResourceMap', () => {
  const getWrapper = props => shallowWithIntl(
    <ISearchFilters {...defaultProps} {...props} />,
  );

  test('renders correctly', () => {
    const originalDate = Date;
    const mockDate = new Date(2017, 12 - 1, 10);
    global.Date = () => mockDate;

    const wrapper = getWrapper();

    expect(toJSON(wrapper)).toMatchSnapshot();

    global.Date = originalDate;
  });

  // A bit of an ugly test, but I want to guard this internal
  // representation from being changed by accident.
  test('parses availableBetween before adding into state', () => {
    const date0 = '2017-07-07';
    const date1 = '2017-08-08';
    const filters = {
      availableBetween: datetimeRange(date0).join(','),
    };
    const wrapper = getWrapper({ filters });

    expect(wrapper.state().filters.availableBetween).toEqual([startTime, endTime, duration].join(','));

    wrapper.setProps({ filters: { availableBetween: datetimeRange(date1).join(',') } });

    expect(wrapper.state().filters.availableBetween).toEqual([startTime, endTime, duration].join(','));
  });

  test('makes searches with an availableBetween value that includes current selected date', () => {
    const date = '2017-07-07';
    const timeRange = ['12:00', '14:00', 30];
    const onChange = jest.fn(availableBetweenFilter);
    const wrapper = getWrapper({ onChange });

    findDateFilter(wrapper).prop('onChange')(date);
    findTimeRangeFilter(wrapper).prop('onChange')(timeRange.join(','));
    findSubmitButton(wrapper).prop('onClick')();

    expect(onChange).toHaveLastReturnedWith([
      makeDatetime(date, timeRange[0]),
      makeDatetime(date, timeRange[1]),
      timeRange[2],
    ].join(','));
  });

  test('does not inject date when availableBetween is undefined', () => {
    const date = '2017-07-07';
    const onChange = jest.fn(availableBetweenFilter);
    const wrapper = getWrapper({ onChange });

    findDateFilter(wrapper).prop('onChange')(date);
    findSubmitButton(wrapper).prop('onClick')();

    expect(onChange).toHaveLastReturnedWith(undefined);
  });

  test('injects current date into availableBetween when date changes and availableBetween has been set', () => {
    const date = '2017-07-07';
    const timeRange = ['11:00', '14:00', 30];
    const [startTime0, endTime0, duration0] = timeRange;
    const onChange = jest.fn(availableBetweenFilter);
    const wrapper = getWrapper({ onChange });

    findTimeRangeFilter(wrapper).prop('onChange')(timeRange.join(','));
    findDateFilter(wrapper).prop('onChange')(date);
    findSubmitButton(wrapper).prop('onClick')();

    expect(onChange).toHaveLastReturnedWith([
      makeDatetime(date, startTime0),
      makeDatetime(date, endTime0),
      duration0,
    ].join(','));
  });

  test('ignores availableBetween spanning multiple dates and always uses date instead', () => {
    const date0 = '2017-07-07';
    const date1 = '2017-08-08';
    const filters = {
      date: date0,
      availableBetween: datetimeRange(date0, date1).join(','),
    };
    const onChange = jest.fn(availableBetweenFilter);
    const wrapper = getWrapper({ filters, onChange });

    findSubmitButton(wrapper).prop('onClick')();

    expect(onChange).toHaveLastReturnedWith([
      makeDatetime(date0, startTime),
      makeDatetime(date0, endTime),
      duration,
    ].join(','));
  });
});
