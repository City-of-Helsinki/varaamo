import { expect } from 'chai';
import React from 'react';
import DayPicker from 'react-day-picker';
import MomentLocaleUtils from 'react-day-picker/moment';
import simple from 'simple-mock';

import Resource from 'utils/fixtures/Resource';
import { shallowWithIntl } from 'utils/testUtils';
import {
  UnconnectedResourceCalendar as ResourceCalendar,
} from './ResourceCalendar';


describe('shared/resource-calendar/ResourceCalendar', () => {
  const resource = Resource.build();

  const defaultProps = {
    availability: {},
    currentLanguage: 'en',
    selectedDate: '2015-10-11',
    onDateChange: simple.mock(),
    resource,
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

  it('renders a calendar-legend with correct labels', () => {
    expect(wrapper.find('.calendar-legend .free').text())
      .to.equal('ReservationCalendarPickerLegend.free');
    expect(wrapper.find('.calendar-legend .busy').text())
      .to.equal('ReservationCalendarPickerLegend.busy');
    expect(wrapper.find('.calendar-legend .booked').text())
      .to.equal('ReservationCalendarPickerLegend.booked');
  });

  it('renders correct props', () => {
    expect(dayWrapper.prop('disabledDays').before.valueOf()).to.be.closeTo(
      new Date().valueOf() - 86400000,
      100000
    );
    expect(dayWrapper.prop('enableOutsideDays')).to.be.true;
    expect(dayWrapper.prop('initialMonth')).to.deep.equal(new Date(defaultProps.selectedDate));
    expect(dayWrapper.prop('locale')).to.equal('en');
    expect(dayWrapper.prop('localeUtils')).to.equal(MomentLocaleUtils);
    expect(dayWrapper.prop('onDayClick')).to.equal(defaultProps.onDateChange);
    expect(dayWrapper.prop('selectedDays')).to.deep.equal(new Date(defaultProps.selectedDate));
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
});
