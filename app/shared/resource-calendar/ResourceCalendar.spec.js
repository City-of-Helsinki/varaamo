import { expect } from 'chai';
import mockDate from 'mockdate';
import moment from 'moment';
import React from 'react';
import DayPicker from 'react-day-picker';
import FormControl from 'react-bootstrap/lib/FormControl';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import MomentLocaleUtils from 'react-day-picker/moment';
import simple from 'simple-mock';

import { shallowWithIntl } from 'utils/testUtils';
import {
  UnconnectedResourceCalendar as ResourceCalendar,
} from './ResourceCalendar';
import ResourceCalendarOverlay from './ResourceCalendarOverlay';

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
  before(() => {
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

  it('renders DayPicker', () => {
    expect(dayWrapper.length).to.equal(1);
  });

  it('renders FormGroup with correct props', () => {
    const formGroup = wrapper.find(FormGroup);

    expect(formGroup.length).to.equal(1);
    expect(formGroup.prop('onClick')).to.equal(wrapper.instance().showOverlay);
  });

  it('renders FormControl with correct props', () => {
    const formControl = wrapper.find(FormControl);
    const expected = moment('2015-10-11').format('dddd D. MMMM YYYY');

    expect(formControl.length).to.equal(1);
    expect(formControl.prop('disabled')).to.be.true;
    expect(formControl.prop('type')).to.equal('text');
    expect(formControl.prop('value')).to.equal(expected);
  });

  it('renders ResourceCalendarOverlay with correct props', () => {
    const resourceCalendarOverlay = wrapper.find(ResourceCalendarOverlay);

    expect(resourceCalendarOverlay.length).to.equal(1);
  });

  it('renders a calendar-legend with correct labels', () => {
    expect(wrapper.find('.calendar-legend .free').text())
      .to.equal('ReservationCalendarPickerLegend.free');
    expect(wrapper.find('.calendar-legend .busy').text())
      .to.equal('ReservationCalendarPickerLegend.busy');
    expect(wrapper.find('.calendar-legend .booked').text())
      .to.equal('ReservationCalendarPickerLegend.booked');
  });

  it('renders correct props', () => {
    expect(dayWrapper.prop('disabledDays')).to.exist;
    expect(dayWrapper.prop('enableOutsideDays')).to.be.true;
    expect(dayWrapper.prop('initialMonth')).to.deep.equal(new Date(defaultProps.selectedDate));
    expect(dayWrapper.prop('locale')).to.equal('en');
    expect(dayWrapper.prop('localeUtils')).to.equal(MomentLocaleUtils);
    expect(dayWrapper.prop('onDayClick')).to.equal(wrapper.instance().handleDateChange);
    expect(dayWrapper.prop('selectedDays').getFullYear()).to.equal(2015);
    expect(dayWrapper.prop('selectedDays').getMonth()).to.equal(9);
    expect(dayWrapper.prop('selectedDays').getDate()).to.equal(11);
  });

  describe('disabledDays', () => {
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
    before(() => {
      isDisabled = dayWrapper.prop('disabledDays');
    });

    afterEach(() => {
      mockDate.reset();
    });

    it('disables yesterday', () => {
      mockDate.set(now);
      expect(isDisabled(receivedYesterday)).to.be.true;
    });

    it('enables today now', () => {
      mockDate.set(now);
      expect(isDisabled(receivedToday)).to.be.false;
    });

    it('enables today early', () => {
      mockDate.set(todayEarly);
      expect(isDisabled(receivedToday)).to.be.false;
    });

    it('enables today late', () => {
      mockDate.set(todayLate);
      expect(isDisabled(receivedToday)).to.be.false;
    });

    it('enables tomorrow', () => {
      mockDate.set(now);
      expect(isDisabled(receivedTomorrow)).to.be.false;
    });
  });

  describe('modifiers', () => {
    it('is available if percentage is greater than 80', () => {
      const func = dayWrapper.prop('modifiers').available;
      expect(func(new Date('2015-10-01'))).to.be.false;
      expect(func(new Date('2015-10-02'))).to.be.false;
      expect(func(new Date('2015-10-03'))).to.be.true;
      expect(func(new Date('2015-10-04'))).to.be.true;
    });
    it('is busy if percentage is lower than 80', () => {
      const func = dayWrapper.prop('modifiers').busy;
      expect(func(new Date('2015-10-01'))).to.be.false;
      expect(func(new Date('2015-10-02'))).to.be.true;
      expect(func(new Date('2015-10-03'))).to.be.false;
      expect(func(new Date('2015-10-04'))).to.be.false;
    });
    it('is booked if percentage is 0', () => {
      const func = dayWrapper.prop('modifiers').booked;
      expect(func(new Date('2015-10-01'))).to.be.true;
      expect(func(new Date('2015-10-02'))).to.be.false;
      expect(func(new Date('2015-10-03'))).to.be.false;
      expect(func(new Date('2015-10-04'))).to.be.false;
    });
  });

  describe('handleDateChange', () => {
    it('sets state visible false and calls prop onDateChange', () => {
      const onDateChange = simple.stub();
      const date = new Date('2015-10-01');
      const instance = getWrapper({ onDateChange }).instance();
      instance.state.visible = true;
      instance.handleDateChange(date);

      expect(instance.state.visible).to.be.false;
      expect(onDateChange.callCount).to.equal(1);
      expect(onDateChange.lastCall.args).to.deep.equal([date]);
    });
  });

  describe('hideOverlay', () => {
    it('sets state.visible to false', () => {
      const instance = getWrapper().instance();
      instance.state.visible = true;
      instance.hideOverlay();
      expect(instance.state.visible).to.be.false;
    });
  });

  describe('showOverlay', () => {
    it('sets state.visible to true', () => {
      const instance = getWrapper().instance();
      instance.state.visible = false;
      instance.showOverlay();
      expect(instance.state.visible).to.be.true;
    });
  });
});
