import { expect } from 'chai';
import { shallow } from 'enzyme';
import mockDate from 'mockdate';
import moment from 'moment';
import React from 'react';
import Select from 'react-select';
import simple from 'simple-mock';

import TimeControls from './TimeControls';

describe('shared/reservation-confirmation/TimeControls', () => {
  const defaultProps = {
    begin: {
      input: {
        onChange: () => null,
        value: '2017-01-01T10:00:00+02:00',
      },
    },
    end: {
      input: {
        onChange: () => null,
        value: '2017-01-01T11:30:00+02:00',
      },
    },
    timeSlots: [],
  };

  function getWrapper(props) {
    return shallow(<TimeControls {...defaultProps} {...props} />);
  }

  describe('render', () => {
    it('renders div.app-TimeControls', () => {
      expect(getWrapper().find('div.app-TimeControls')).to.have.length(1);
    });

    it('renders Select for changing reservation begin time', () => {
      const wrapper = getWrapper();
      const beginTimeControl = wrapper.find(Select).at(0);
      const expectedValue = moment(defaultProps.begin.input.value).format('HH:mm');
      expect(beginTimeControl).to.have.length(1);
      expect(beginTimeControl.prop('value')).to.equal(expectedValue);
      expect(beginTimeControl.prop('onChange')).to.equal(wrapper.instance().handleBeginTimeChange);
      expect(beginTimeControl.prop('options')).to.deep.equal(wrapper.instance().getBeginTimeOptions());
    });

    it('renders time Select for changing reservation end time', () => {
      const wrapper = getWrapper();
      const endTimeControl = wrapper.find(Select).at(1);
      const expectedValue = moment(defaultProps.end.input.value).format('HH:mm');
      expect(endTimeControl).to.have.length(1);
      expect(endTimeControl.prop('value')).to.equal(expectedValue);
      expect(endTimeControl.prop('onChange')).to.equal(wrapper.instance().handleEndTimeChange);
      expect(endTimeControl.prop('options')).to.deep.equal(wrapper.instance().getEndTimeOptions());
    });
  });

  describe('getBeginTimeOptions', () => {
    it('returns start time of every free time slot as time options', () => {
      mockDate.set('2016-01-01T06:30+02:00');
      const timeSlots = [
        { start: '2017-01-01T05:00+02:00', end: '2017-01-01T06:00+02:00', reserved: false },
        { start: '2017-01-01T06:00+02:00', end: '2017-01-01T07:00+02:00', reserved: true },
        { start: '2017-01-01T07:00+02:00', end: '2017-01-01T08:00+02:00', reserved: false },
        { start: '2017-01-01T08:00+02:00', end: '2017-01-01T09:00+02:00', reserved: false },
        { start: '2017-01-01T09:00+02:00', end: '2017-01-01T10:00+02:00', reserved: true },
        { start: '2017-01-01T10:00+02:00', end: '2017-01-01T11:00+02:00', reserved: false },
      ];
      const wrapper = getWrapper({ timeSlots });
      const options = wrapper.instance().getBeginTimeOptions();
      const expected = [
        { label: '05:00', value: '05:00' },
        { label: '07:00', value: '07:00' },
        { label: '08:00', value: '08:00' },
        { label: '10:00', value: '10:00' },
      ];
      mockDate.reset();
      expect(options).to.deep.equal(expected);
    });

    it('does not return start times before the current time', () => {
      mockDate.set('2017-01-01T07:25+02:00');

      const timeSlots = [
        { start: '2017-01-01T05:00+02:00', end: '2017-01-01T06:00+02:00', reserved: false },
        { start: '2017-01-01T06:00+02:00', end: '2017-01-01T07:00+02:00', reserved: false },
        { start: '2017-01-01T07:00+02:00', end: '2017-01-01T08:00+02:00', reserved: false },
        { start: '2017-01-01T08:00+02:00', end: '2017-01-01T09:00+02:00', reserved: false },
      ];
      const wrapper = getWrapper({ timeSlots });
      const options = wrapper.instance().getBeginTimeOptions();
      const expected = [
        { label: '07:00', value: '07:00' },
        { label: '08:00', value: '08:00' },
      ];
      mockDate.reset();
      expect(options).to.deep.equal(expected);
    });
  });

  describe('getEndTimeOptions', () => {
    it('returns end time of every free time slot from begin to next unavailable slot', () => {
      const begin = {
        input: {
          onChange: () => null,
          value: '2017-01-01T10:00:00+02:00',
        },
      };
      const timeSlots = [
        { end: '2017-01-01T05:00+02:00', reserved: false },
        { end: '2017-01-01T06:00+02:00', reserved: true },
        { end: '2017-01-01T07:00+02:00', reserved: false },
        { end: '2017-01-01T08:00+02:00', reserved: false },
        { end: '2017-01-01T09:00+02:00', reserved: true },
        { end: '2017-01-01T10:00+02:00', reserved: false },
        { end: '2017-01-01T11:00+02:00', reserved: false },
        { end: '2017-01-01T12:00+02:00', reserved: false },
        { end: '2017-01-01T13:00+02:00', reserved: true },
        { end: '2017-01-01T14:00+02:00', reserved: false },
      ];
      const wrapper = getWrapper({ begin, timeSlots });
      const options = wrapper.instance().getEndTimeOptions();
      const expected = [
        { label: '11:00 (1 h)', value: '11:00' },
        { label: '12:00 (2 h)', value: '12:00' },
      ];
      expect(options).to.deep.equal(expected);
    });

    it('returns time slots only within maxReservationPeriod if maxReservationPeriod given', () => {
      const begin = {
        input: {
          onChange: () => null,
          value: '2017-01-01T04:00:00+02:00',
        },
      };
      const maxReservationPeriod = '02:00:00';
      const timeSlots = [
        { end: '2017-01-01T05:00+02:00', reserved: false },
        { end: '2017-01-01T06:00+02:00', reserved: false },
        { end: '2017-01-01T07:00+02:00', reserved: false },
        { end: '2017-01-01T08:00+02:00', reserved: false },
        { end: '2017-01-01T09:00+02:00', reserved: false },
        { end: '2017-01-01T10:00+02:00', reserved: false },
      ];
      const wrapper = getWrapper({ begin, maxReservationPeriod, timeSlots });
      const options = wrapper.instance().getEndTimeOptions();
      const expected = [
        { label: '05:00 (1 h)', value: '05:00' },
        { label: '06:00 (2 h)', value: '06:00' },
      ];
      expect(options).to.deep.equal(expected);
    });
  });

  describe('handleBeginTimeChange', () => {
    const newEndOptions = [
      { label: '16:00', value: '16:00' },
      { label: '16:00', value: '16:30' },
    ];

    function callHandleBeginTimeChange(props, value) {
      const instance = getWrapper(props).instance();
      simple.mock(instance, 'getEndTimeOptions').returnWith(newEndOptions);
      instance.handleBeginTimeChange({ value });
      simple.restore(instance, 'getEndTimeOptions');
    }

    describe('with valid time value', () => {
      it('calls begin.input.onChange with time updated in begin.input.value', () => {
        const onChange = simple.mock();
        const props = {
          begin: { input: { onChange, value: '2017-01-01T10:00:00+02:00' } },
        };
        const value = '15:30';
        const expectedArg = moment('2017-01-01T15:30:00').toISOString();
        callHandleBeginTimeChange(props, value);
        expect(onChange.callCount).to.equal(1);
        expect(onChange.lastCall.args).to.deep.equal([expectedArg]);
      });

      it('calls end.input.onChange with correct value if old end time is no longer valid', () => {
        const onChange = simple.mock();
        const currentEndValue = moment('2017-01-01T10:00:00').toISOString();
        const props = {
          end: { input: { onChange, value: currentEndValue } },
        };
        const value = '15:30';
        callHandleBeginTimeChange(props, value);
        const expectedArg = moment('2017-01-01T16:00:00').toISOString();
        expect(onChange.callCount).to.equal(1);
        expect(onChange.lastCall.args).to.deep.equal([expectedArg]);
      });

      it('does not call end.input.onChange if old end time is still valid', () => {
        const onChange = simple.mock();
        const currentEndValue = moment('2017-01-01T16:30:00').toISOString();
        const props = {
          end: { input: { onChange, value: currentEndValue } },
        };
        const value = '15:30';
        callHandleBeginTimeChange(props, value);
        expect(onChange.callCount).to.equal(0);
      });
    });

    describe('with empty time value', () => {
      it('does not call begin.input.onChange', () => {
        const onChange = simple.mock();
        const props = {
          begin: { input: { onChange, value: '2017-01-01T10:00:00+02:00' } },
        };
        const value = '';
        callHandleBeginTimeChange(props, value);
        expect(onChange.callCount).to.equal(0);
      });
    });
  });

  describe('handleEndTimeChange', () => {
    function callHandleEndTimeChange(onChange, value) {
      const currentValue = moment('2017-01-01T12:00:00').toISOString();
      const props = {
        end: { input: { onChange, value: currentValue } },
      };
      const wrapper = getWrapper(props);
      wrapper.instance().handleEndTimeChange({ value });
    }

    describe('with valid time value', () => {
      it('calls end.input.onChange with time updated in end.input.value', () => {
        const onChange = simple.mock();
        const value = '18:00';
        const expectedArg = moment('2017-01-01T18:00:00').toISOString();
        callHandleEndTimeChange(onChange, value);
        expect(onChange.callCount).to.equal(1);
        expect(onChange.lastCall.args).to.deep.equal([expectedArg]);
      });
    });

    describe('with empty time value', () => {
      it('does not call end.input.onChange', () => {
        const onChange = simple.mock();
        const value = '';
        callHandleEndTimeChange(onChange, value);
        expect(onChange.callCount).to.equal(0);
      });
    });
  });
});
