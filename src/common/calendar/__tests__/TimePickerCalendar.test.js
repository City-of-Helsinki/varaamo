import React from 'react';
import toJson from 'enzyme-to-json';

import TimePickerCalendar from '../TimePickerCalendar';
import resource from '../../data/fixtures/resource';
import { globalDateMock, shallowWithIntl } from '../../../../app/utils/testUtils';

describe('TimePickerCalendar', () => {
  globalDateMock();

  const defaultProps = {
    resource: resource.build(),
    date: '2019-08-15',
    onDateChange: jest.fn(),
    onReserve: jest.fn(),
    onTimeChange: jest.fn(),
  };

  const defaultSelected = {
    start: '2019-09-05T10:30:00+03:00',
    end: '2019-09-05T12:00:00+03:00'
  };

  const selected = {
    start: '2019-09-05T11:30:00+03:00',
    end: '2019-09-05T12:00:00+03:00'
  };

  const getWrapper = props => shallowWithIntl(<TimePickerCalendar {...defaultProps} {...props} />);
  test('render normally', () => {
    const wrapper = getWrapper();

    expect(toJson(wrapper)).toMatchSnapshot();
  });

  test('will have selected state intitialize from defaultSelected props', () => {
    const wrapper = getWrapper();
    wrapper.setProps({ defaultSelected });
    wrapper.update();
    expect(wrapper.state('selected')).toEqual(defaultSelected);
  });

  test('will populate new reservation event when initialize with defaultSelected', () => {
    const wrapper = getWrapper();
    wrapper.setProps({ defaultSelected });
    wrapper.update();
    const events = wrapper.instance().getEvents();
    expect(events[0].classNames[1]).toContain('newReservation');
  });

  test('defaultSelected will respect already selected slot', () => {
    const wrapper = getWrapper();
    wrapper.setState({ selected });
    wrapper.setProps({ defaultSelected });
    wrapper.update();
    expect(wrapper.state('selected')).toEqual(selected);
  });
});
