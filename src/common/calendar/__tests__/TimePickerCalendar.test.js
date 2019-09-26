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
    addNotification: jest.fn(),
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

  describe('edittingReservation', () => {
    const defaultSelected = {
      begin: '2019-09-05T10:30:00+03:00',
      end: '2019-09-05T12:00:00+03:00'
    };

    const edittingReservation = reservation.build(defaultSelected);

    const wrapper = getWrapper({ edittingReservation });

    test('will have selected state intitialize from edittingReservation props', () => {
      expect(wrapper.state('selected')).toEqual(selected);
    });

    test('will populate new reservation event with timeslot selected from edittingReservation', () => {
      const events = wrapper.instance().getEvents();
      expect(events[0].classNames[1]).toContain('newReservation');
    });

    test('will render edittingReservation slot when cancel current selected slot', () => {
      wrapper.setState({
        selected: {
          start: '2019-09-05T13:30:00+03:00',
          end: '2019-09-05T14:00:00+03:00'
        }
      });

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

      // Return data match default from reservation
      expect(wrapper.state('selected')).toEqual(selected);
    });
  });
});
