import { expect } from 'chai';
import React from 'react';
import simple from 'simple-mock';

import { shallowWithIntl } from 'utils/testUtils';
import TimeRangeControl from './TimeRangeControl';

const defaults = {
  duration: 30,
  end: '16:00',
  onChange: simple.mock(),
  onTimeRangeSwitch: simple.mock(),
  start: '10:00',
};
function getWrapper(props) {
  return shallowWithIntl(<TimeRangeControl {...defaults} {...props} />);
}

describe('pages/search/controls/TimeRangeControl', () => {
  it('renders a div.app-TimeRangeControl', () => {
    const wrapper = getWrapper();
    expect(wrapper.is('div.app-TimeRangeControl')).to.be.true;
  });

  it('renders start select control with correct props', () => {
    const wrapper = getWrapper();
    const startSelect = wrapper.find('.app-TimeRangeControl__range-start');
    const expectedOptions = [
      { label: '00:00', value: '00:00' },
      { label: '00:30', value: '00:30' },
      { label: '01:00', value: '01:00' },
      { label: '01:30', value: '01:30' },
      { label: '02:00', value: '02:00' },
      { label: '02:30', value: '02:30' },
      { label: '03:00', value: '03:00' },
      { label: '03:30', value: '03:30' },
      { label: '04:00', value: '04:00' },
      { label: '04:30', value: '04:30' },
      { label: '05:00', value: '05:00' },
      { label: '05:30', value: '05:30' },
      { label: '06:00', value: '06:00' },
      { label: '06:30', value: '06:30' },
      { label: '07:00', value: '07:00' },
      { label: '07:30', value: '07:30' },
      { label: '08:00', value: '08:00' },
      { label: '08:30', value: '08:30' },
      { label: '09:00', value: '09:00' },
      { label: '09:30', value: '09:30' },
      { label: '10:00', value: '10:00' },
      { label: '10:30', value: '10:30' },
      { label: '11:00', value: '11:00' },
      { label: '11:30', value: '11:30' },
      { label: '12:00', value: '12:00' },
      { label: '12:30', value: '12:30' },
      { label: '13:00', value: '13:00' },
      { label: '13:30', value: '13:30' },
      { label: '14:00', value: '14:00' },
      { label: '14:30', value: '14:30' },
      { label: '15:00', value: '15:00' },
      { label: '15:30', value: '15:30' },
      { label: '16:00', value: '16:00' },
      { label: '16:30', value: '16:30' },
      { label: '17:00', value: '17:00' },
      { label: '17:30', value: '17:30' },
      { label: '18:00', value: '18:00' },
      { label: '18:30', value: '18:30' },
      { label: '19:00', value: '19:00' },
      { label: '19:30', value: '19:30' },
      { label: '20:00', value: '20:00' },
      { label: '20:30', value: '20:30' },
      { label: '21:00', value: '21:00' },
      { label: '21:30', value: '21:30' },
      { label: '22:00', value: '22:00' },
      { label: '22:30', value: '22:30' },
      { label: '23:00', value: '23:00' },
    ];

    expect(startSelect).to.have.length(1);
    expect(startSelect.prop('clearable')).to.be.false;
    expect(startSelect.prop('name')).to.equal('time-filter-start-select');
    expect(startSelect.prop('onChange')).to.equal(wrapper.instance().handleStart);
    expect(startSelect.prop('options')).to.deep.equal(expectedOptions);
    expect(startSelect.prop('placeholder')).to.be.empty;
    expect(startSelect.prop('searchable')).to.be.false;
    expect(startSelect.prop('value')).to.equal(defaults.start);
  });

  it('renders end select control with correct props', () => {
    const wrapper = getWrapper();
    const endSelect = wrapper.find('.app-TimeRangeControl__range-end');
    const expectedOptions = [
      { label: '10:30', value: '10:30' },
      { label: '11:00', value: '11:00' },
      { label: '11:30', value: '11:30' },
      { label: '12:00', value: '12:00' },
      { label: '12:30', value: '12:30' },
      { label: '13:00', value: '13:00' },
      { label: '13:30', value: '13:30' },
      { label: '14:00', value: '14:00' },
      { label: '14:30', value: '14:30' },
      { label: '15:00', value: '15:00' },
      { label: '15:30', value: '15:30' },
      { label: '16:00', value: '16:00' },
      { label: '16:30', value: '16:30' },
      { label: '17:00', value: '17:00' },
      { label: '17:30', value: '17:30' },
      { label: '18:00', value: '18:00' },
      { label: '18:30', value: '18:30' },
      { label: '19:00', value: '19:00' },
      { label: '19:30', value: '19:30' },
      { label: '20:00', value: '20:00' },
      { label: '20:30', value: '20:30' },
      { label: '21:00', value: '21:00' },
      { label: '21:30', value: '21:30' },
      { label: '22:00', value: '22:00' },
      { label: '22:30', value: '22:30' },
      { label: '23:00', value: '23:00' },
      { label: '23:30', value: '23:30' },
    ];

    expect(endSelect).to.have.length(1);
    expect(endSelect.prop('clearable')).to.be.false;
    expect(endSelect.prop('name')).to.equal('time-filter-end-select');
    expect(endSelect.prop('onChange')).to.equal(wrapper.instance().handleEnd);
    expect(endSelect.prop('options')).to.deep.equal(expectedOptions);
    expect(endSelect.prop('placeholder')).to.be.empty;
    expect(endSelect.prop('searchable')).to.be.false;
    expect(endSelect.prop('value')).to.equal(defaults.end);
  });

  it('renders duration select control for 12h with correct props', () => {
    const wrapper = getWrapper({ end: '23:30', start: '08:00' });
    const endSelect = wrapper.find('.app-TimeRangeControl__range-duration');
    const expectedOptions = [
      { label: '0.5 h', value: 30 },
      { label: '1 h', value: 60 },
      { label: '1.5 h', value: 90 },
      { label: '2 h', value: 120 },
      { label: '2.5 h', value: 150 },
      { label: '3 h', value: 180 },
      { label: '3.5 h', value: 210 },
      { label: '4 h', value: 240 },
      { label: '4.5 h', value: 270 },
      { label: '5 h', value: 300 },
      { label: '5.5 h', value: 330 },
      { label: '6 h', value: 360 },
      { label: '6.5 h', value: 390 },
      { label: '7 h', value: 420 },
      { label: '7.5 h', value: 450 },
      { label: '8 h', value: 480 },
      { label: '8.5 h', value: 510 },
      { label: '9 h', value: 540 },
      { label: '9.5 h', value: 570 },
      { label: '10 h', value: 600 },
      { label: '10.5 h', value: 630 },
      { label: '11 h', value: 660 },
      { label: '11.5 h', value: 690 },
      { label: '12 h', value: 720 },
    ];

    expect(endSelect).to.have.length(1);
    expect(endSelect.prop('clearable')).to.be.false;
    expect(endSelect.prop('name')).to.equal('time-filter-duration-select');
    expect(endSelect.prop('onChange')).to.equal(wrapper.instance().handleDuration);
    expect(endSelect.prop('options')).to.deep.equal(expectedOptions);
    expect(endSelect.prop('placeholder')).to.be.empty;
    expect(endSelect.prop('searchable')).to.be.false;
    expect(endSelect.prop('value')).to.equal(defaults.duration);
  });

  it('renders correct duration select control based on start and end time', () => {
    const wrapper = getWrapper({ end: '23:30', start: '20:30' });
    const endSelect = wrapper.find('.app-TimeRangeControl__range-duration');
    const expectedOptions = [
      { label: '0.5 h', value: 30 },
      { label: '1 h', value: 60 },
      { label: '1.5 h', value: 90 },
      { label: '2 h', value: 120 },
      { label: '2.5 h', value: 150 },
      { label: '3 h', value: 180 },
    ];

    expect(endSelect).to.have.length(1);
    expect(endSelect.prop('options')).to.deep.equal(expectedOptions);
  });

  describe('handleStart', () => {
    it('calls onChange with correct propTypes', () => {
      const onChange = simple.mock();
      const instance = getWrapper({ onChange }).instance();
      const expected = {
        duration: defaults.duration,
        end: defaults.end,
        start: '12:00',
      };
      instance.handleStart({ value: '12:00' });
      expect(onChange.callCount).to.equal(1);
      expect(onChange.lastCall.args).to.deep.equal([expected]);
    });
  });

  describe('handleEnd', () => {
    it('calls onChange with correct propTypes', () => {
      const onChange = simple.mock();
      const instance = getWrapper({ onChange }).instance();
      const expected = {
        duration: defaults.duration,
        end: '18:00',
        start: defaults.start,
      };
      instance.handleEnd({ value: '18:00' });
      expect(onChange.callCount).to.equal(1);
      expect(onChange.lastCall.args).to.deep.equal([expected]);
    });
  });

  describe('handleDuration', () => {
    it('calls onChange with correct propTypes', () => {
      const onChange = simple.mock();
      const instance = getWrapper({ onChange }).instance();
      const expected = {
        duration: 60,
        end: defaults.end,
        start: defaults.start,
      };
      instance.handleDuration({ value: 60 });
      expect(onChange.callCount).to.equal(1);
      expect(onChange.lastCall.args).to.deep.equal([expected]);
    });
  });
});
