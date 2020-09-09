import React from 'react';
import toJson from 'enzyme-to-json';

import {
  mountWithIntl,
  shallowWithIntl,
} from '../../../../app/utils/testUtils';
import DateRangePicker from '../DateRangePicker';
import DateRangeSummary from '../summary/DateRangeSummary';
import DateRangeLegend from '../legend/DateRangeLegend';

const mockProps = {
  fullDay: false,
  maxDuration: 7,
  minDuration: 2,
  openingPeriods: [
    {
      from: new Date(2017, 11, 5),
      to: new Date(2100, 1),
      maxDuration: 7,
      minDuration: 2,
      startingTime: { hours: 15, min: 0 },
      endingTime: { hours: 11, min: 0 },
      durationUnit: 'hour',
    },
  ],
  reservations: [
    {
      from: new Date(2017, 11, 26),
      to: new Date(2017, 11, 28),
    },
  ],
  startingDays: [
    new Date(2017, 11, 10),
    new Date(2017, 11, 15),
    new Date(2017, 11, 20),
  ],
  initialMonth: new Date(2017, 11, 10),
};

describe('DateRangePicker', () => {
  const getShallowWrapper = props => shallowWithIntl(<DateRangePicker {...props} />);
  const getMountedWrapper = props => mountWithIntl(<DateRangePicker {...props} />);

  test('renders normally', () => {
    const wrapper = getShallowWrapper(mockProps);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  test('renders child component', () => {
    const wrapper = getShallowWrapper({
      ...mockProps,
      renderChildComponent: selectedDateRange => (
        <>
          <DateRangeSummary
            endDate={selectedDateRange.to}
            startDate={selectedDateRange.from}
          />
          <DateRangeLegend />
        </>
      ),
    });
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  const expectNoSelection = wrapper => expect(
    wrapper.find('.DayPicker').some('.DayPicker-Day--selectionStart'),
  ).toBe(false);

  const selectValidRange = (wrapper) => {
    wrapper.find('.DayPicker-Day--startingDay').at(0).simulate('click');
    wrapper.find('.DayPicker-Day--startingDay').at(1).simulate('click');
  };

  test('selection of non-starting days is not permitted', () => {
    const wrapper = getMountedWrapper(mockProps);

    wrapper.find('.DayPicker-Day').at(0).simulate('click');
    expectNoSelection(wrapper);
  });

  test('clicking after full selection is made clears selection', () => {
    const wrapper = getMountedWrapper(mockProps);

    selectValidRange(wrapper);
    wrapper.find('.DayPicker-Day--startingDay').at(2).simulate('click');
    expectNoSelection(wrapper);
  });

  test('valid value calls callback', () => {
    const mockOnRangeSelect = jest.fn();
    const wrapper = getMountedWrapper({
      ...mockProps,
      onRangeSelect: mockOnRangeSelect,
    });

    selectValidRange(wrapper);
    expect(mockOnRangeSelect).toBeCalledTimes(1);
    expect(mockOnRangeSelect).toBeCalledWith({
      from: new Date(2017, 11, 10, 15, 0),
      to: new Date(2017, 11, 15, 11, 0),
    });
  });
});
