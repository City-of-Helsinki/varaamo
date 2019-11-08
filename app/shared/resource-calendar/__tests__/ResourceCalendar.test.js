import mockDate from 'mockdate';
import moment from 'moment';
import React from 'react';
import DayPicker from 'react-day-picker';
import FormControl from 'react-bootstrap/lib/FormControl';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import MomentLocaleUtils from 'react-day-picker/moment';
import simple from 'simple-mock';

import { shallowWithIntl } from '../../../utils/testUtils';
import {
  UnconnectedResourceCalendar as ResourceCalendar,
} from '../ResourceCalendar';
import ResourceCalendarOverlay from '../ResourceCalendarOverlay';

describe('shared/resource-calendar/ResourceCalendar', () => {
  const defaultProps = {
    availability: {},
    currentLanguage: 'en',
    selectedDate: '2015-10-11',
    onDateChange: simple.mock(),
  };
  function getWrapper(props) {
    return shallowWithIntl(<ResourceCalendar {...defaultProps} {...props} />);
  }

  let dayWrapper;
  let wrapper;
  beforeAll(() => {
    wrapper = getWrapper({
      availability: {
        '2015-10-01': { percentage: 0 },
        '2015-10-02': { percentage: 50 },
        '2015-10-03': { percentage: 81 },
        '2015-10-04': { percentage: 100 },
      },
    });
    dayWrapper = wrapper.find(DayPicker);
  });

  test('renders DayPicker', () => {
    expect(dayWrapper.length).toBe(1);
  });

  test('renders FormGroup with correct props', () => {
    const formGroup = wrapper.find(FormGroup);

    expect(formGroup.length).toBe(1);
    expect(formGroup.prop('onClick')).toBe(wrapper.instance().showOverlay);
  });

  test('renders FormControl with correct props', () => {
    const formControl = wrapper.find(FormControl);
    const expected = moment('2015-10-11').format('dddd D. MMMM YYYY');

    expect(formControl.length).toBe(1);
    expect(formControl.prop('disabled')).toBe(true);
    expect(formControl.prop('type')).toBe('text');
    expect(formControl.prop('value')).toBe(expected);
  });

  test('renders ResourceCalendarOverlay with correct props', () => {
    const resourceCalendarOverlay = wrapper.find(ResourceCalendarOverlay);

    expect(resourceCalendarOverlay.length).toBe(1);
  });

  test('renders a calendar-legend with correct labels', () => {
    expect(wrapper.find('.calendar-legend .free').text()).toBe('ReservationCalendarPickerLegend.free');
    expect(wrapper.find('.calendar-legend .busy').text()).toBe('ReservationCalendarPickerLegend.busy');
    expect(wrapper.find('.calendar-legend .booked').text()).toBe('ReservationCalendarPickerLegend.booked');
  });

  test('renders correct props', () => {
    expect(dayWrapper.prop('disabledDays')).toBeDefined();
    expect(dayWrapper.prop('enableOutsideDays')).toBe(true);
    expect(dayWrapper.prop('initialMonth')).toEqual(new Date(defaultProps.selectedDate));
    expect(dayWrapper.prop('locale')).toBe('en');
    expect(dayWrapper.prop('localeUtils')).toBe(MomentLocaleUtils);
    expect(dayWrapper.prop('onDayClick')).toBe(wrapper.instance().handleDateChange);
    expect(dayWrapper.prop('selectedDays').getFullYear()).toBe(2015);
    expect(dayWrapper.prop('selectedDays').getMonth()).toBe(9);
    expect(dayWrapper.prop('selectedDays').getDate()).toBe(11);
  });

  describe('disabledDays', () => {
    describe('if the isDayReservable function prop is supplied as prop', () => {
      const isDayReservable = simple.stub();
      const date = new Date('2015-10-01');
      const withDisableDays = getWrapper({ isDayReservable }).find(DayPicker);
      let isDisabled;
      beforeAll(() => {
        isDisabled = withDisableDays.prop('disabledDays');
      });

      afterEach(() => {
        mockDate.reset();
      });

      test('calls isDayReservable function', () => {
        isDisabled(date);
        expect(isDayReservable.callCount).toBe(1);
      });

      test('calls isDayReservable with the right arguments', () => {
        isDisabled(date);
        expect(isDayReservable.calls[0].arg).toBe(date);
      });
    });

    describe('if the isDayReservable function is not supplied as prop', () => {
      const now = new Date();
      const todayEarly = new Date();
      todayEarly.setHours(0, 1, 0, 0);
      const todayLate = new Date();
      todayLate.setHours(23, 0, 0, 0);
      const receivedToday = new Date(now);
      const receivedYesterday = new Date(now.valueOf() - 86400000);
      const receivedTomorrow = new Date(now.valueOf() + 86400000);
      receivedToday.setHours(12, 0, 0, 0);
      receivedTomorrow.setHours(12, 0, 0, 0);
      receivedYesterday.setHours(12, 0, 0, 0);
      let isDisabled;
      beforeAll(() => {
        isDisabled = dayWrapper.prop('disabledDays');
      });

      afterEach(() => {
        mockDate.reset();
      });

      test('disables yesterday', () => {
        mockDate.set(now);
        expect(isDisabled(receivedYesterday)).toBe(true);
      });

      test('enables today now', () => {
        mockDate.set(now);
        expect(isDisabled(receivedToday)).toBe(false);
      });

      test('enables today early', () => {
        mockDate.set(todayEarly);
        expect(isDisabled(receivedToday)).toBe(false);
      });

      test('enables today late', () => {
        mockDate.set(todayLate);
        expect(isDisabled(receivedToday)).toBe(false);
      });

      test('enables tomorrow', () => {
        mockDate.set(now);
        expect(isDisabled(receivedTomorrow)).toBe(false);
      });
    });
  });

  describe('setCalendarWrapper', () => {
    test('sets calendarWrapper property to the supplied element', () => {
      const element = {};
      const instance = getWrapper().instance();
      instance.setCalendarWrapper(element);

      expect(instance.calendarWrapper).toBe(element);
    });
  });

  describe('modifiers', () => {
    test('is available if percentage is greater than 80', () => {
      const func = dayWrapper.prop('modifiers').available;
      expect(func(new Date('2015-10-01'))).toBe(false);
      expect(func(new Date('2015-10-02'))).toBe(false);
      expect(func(new Date('2015-10-03'))).toBe(true);
      expect(func(new Date('2015-10-04'))).toBe(true);
    });
    test('is busy if percentage is lower than 80', () => {
      const func = dayWrapper.prop('modifiers').busy;
      expect(func(new Date('2015-10-01'))).toBe(false);
      expect(func(new Date('2015-10-02'))).toBe(true);
      expect(func(new Date('2015-10-03'))).toBe(false);
      expect(func(new Date('2015-10-04'))).toBe(false);
    });
    test('is booked if percentage is 0', () => {
      const func = dayWrapper.prop('modifiers').booked;
      expect(func(new Date('2015-10-01'))).toBe(true);
      expect(func(new Date('2015-10-02'))).toBe(false);
      expect(func(new Date('2015-10-03'))).toBe(false);
      expect(func(new Date('2015-10-04'))).toBe(false);
    });
  });

  describe('handleDateChange', () => {
    test('sets state visible false and calls prop onDateChange', () => {
      const onDateChange = simple.stub();
      const date = new Date('2015-10-01');
      const instance = getWrapper({ onDateChange }).instance();
      instance.state.visible = true;
      instance.handleDateChange(date);

      expect(instance.state.visible).toBe(false);
      expect(onDateChange.callCount).toBe(1);
      expect(onDateChange.lastCall.args).toEqual([date]);
    });
  });

  describe('hideOverlay', () => {
    test('sets state.visible to false', () => {
      const instance = getWrapper().instance();
      instance.state.visible = true;
      instance.hideOverlay();
      expect(instance.state.visible).toBe(false);
    });
  });

  describe('showOverlay', () => {
    test('sets state.visible to true', () => {
      const instance = getWrapper().instance();
      instance.state.visible = false;
      instance.showOverlay();
      expect(instance.state.visible).toBe(true);
    });
  });
});
