import { expect } from 'chai';
import { shallow } from 'enzyme';
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
        value: '2017-01-01T10:00:00+03:00',
      },
    },
    end: {
      input: {
        onChange: () => null,
        value: '2017-01-01T11:30:00+03:00',
      },
    },
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
      expect(beginTimeControl.prop('options')).to.deep.equal(wrapper.instance().getTimeOptions());
    });

    it('renders time Select for changing reservation end time', () => {
      const wrapper = getWrapper();
      const endTimeControl = wrapper.find(Select).at(1);
      const expectedValue = moment(defaultProps.end.input.value).format('HH:mm');
      expect(endTimeControl).to.have.length(1);
      expect(endTimeControl.prop('value')).to.equal(expectedValue);
      expect(endTimeControl.prop('onChange')).to.equal(wrapper.instance().handleEndTimeChange);
      expect(endTimeControl.prop('options')).to.deep.equal(wrapper.instance().getTimeOptions());
    });
  });

  describe('getTimeOptions', () => {
    it('returns time options using props.period as the duration between times ', () => {
      const period = '01:00:00';
      const wrapper = getWrapper({ period });
      const options = wrapper.instance().getTimeOptions();
      const expected = [
        { label: '00:00', value: '00:00' },
        { label: '01:00', value: '01:00' },
        { label: '02:00', value: '02:00' },
        { label: '03:00', value: '03:00' },
        { label: '04:00', value: '04:00' },
        { label: '05:00', value: '05:00' },
        { label: '06:00', value: '06:00' },
        { label: '07:00', value: '07:00' },
        { label: '08:00', value: '08:00' },
        { label: '09:00', value: '09:00' },
        { label: '10:00', value: '10:00' },
        { label: '11:00', value: '11:00' },
        { label: '12:00', value: '12:00' },
        { label: '13:00', value: '13:00' },
        { label: '14:00', value: '14:00' },
        { label: '15:00', value: '15:00' },
        { label: '16:00', value: '16:00' },
        { label: '17:00', value: '17:00' },
        { label: '18:00', value: '18:00' },
        { label: '19:00', value: '19:00' },
        { label: '20:00', value: '20:00' },
        { label: '21:00', value: '21:00' },
        { label: '22:00', value: '22:00' },
        { label: '23:00', value: '23:00' },
      ];
      expect(options).to.deep.equal(expected);
    });
  });

  describe('handleBeginTimeChange', () => {
    function callHandleBeginTimeChange(onChange, value) {
      const currentValue = moment('2017-01-01T10:00:00').toISOString();
      const props = {
        begin: { input: { onChange, value: currentValue } },
      };
      const wrapper = getWrapper(props);
      wrapper.instance().handleBeginTimeChange({ value });
    }

    describe('with valid time value', () => {
      it('calls begin.input.onChange with time updated in begin.input.value', () => {
        const onChange = simple.mock();
        const value = '15:30';
        const expectedArg = moment('2017-01-01T15:30:00').toISOString();
        callHandleBeginTimeChange(onChange, value);
        expect(onChange.callCount).to.equal(1);
        expect(onChange.lastCall.args).to.deep.equal([expectedArg]);
      });
    });

    describe('with empty time value', () => {
      it('does not call begin.input.onChange', () => {
        const onChange = simple.mock();
        const value = '';
        callHandleBeginTimeChange(onChange, value);
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
