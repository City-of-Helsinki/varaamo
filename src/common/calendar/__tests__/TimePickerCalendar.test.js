import React from 'react';
import toJson from 'enzyme-to-json';

import TimePickerCalendar from '../TimePickerCalendar';
import resource from '../../data/fixtures/resource';
import reservation from '../../data/fixtures/reservation';
import { globalDateMock, shallowWithIntl } from '../../../../app/utils/testUtils';

describe('TimePickerCalendar', () => {
  globalDateMock();

  const defaultProps = {
    resource: resource.build(),
    date: '2019-08-15',
    isStaff: false,
    onDateChange: jest.fn(),
    onReserve: jest.fn(),
    onTimeChange: jest.fn(),
  };

  const selected = {
    start: '2019-09-05T10:30:00+03:00',
    end: '2019-09-05T12:00:00+03:00'
  };


  const getWrapper = props => shallowWithIntl(<TimePickerCalendar {...defaultProps} {...props} />);

  describe('FullCalendar', () => {
    test('render normally', () => {
      const wrapper = getWrapper();

      expect(toJson(wrapper)).toMatchSnapshot();
    });
  });

  describe('editingReservation', () => {
    const defaultSelected = {
      begin: '2019-09-05T10:30:00+03:00',
      end: '2019-09-05T12:00:00+03:00'
    };

    const editingReservation = reservation.build(defaultSelected);

    const wrapper = getWrapper({ editingReservation });

    test('will populate new reservation event with timeslot selected from editingReservation', () => {
      const instance = wrapper.instance();
      const events = instance.getEvents();
      expect(events[0].classNames[1]).toContain('newReservation');
    });

    test('will render editingReservation slot when cancel current selected slot', () => {
      // select random time range
      const instance = wrapper.instance();

      // override calendar context with mock
      instance.calendarRef = {
        current: {
          getApi: () => ({
            unselect: jest.fn()
          })
        }
      };

      wrapper.update();

      // Mock on clicking cancel button
      instance.onCancel();
    });
  });
});
