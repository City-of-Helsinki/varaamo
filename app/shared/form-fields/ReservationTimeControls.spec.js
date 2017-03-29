import { expect } from 'chai';
import { shallow } from 'enzyme';
import moment from 'moment';
import React from 'react';
import FormControl from 'react-bootstrap/lib/FormControl';
import simple from 'simple-mock';

import DatePicker from 'shared/date-picker';
import ReservationTimeControls from './ReservationTimeControls';

describe('shared/form-fields/ReservationTimeControls', () => {
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
    return shallow(<ReservationTimeControls {...defaultProps} {...props} />);
  }

  describe('render', () => {
    it('renders div.reservation-time-controls', () => {
      expect(getWrapper().find('div.reservation-time-controls')).to.have.length(1);
    });

    it('renders DatePicker with correct props', () => {
      const wrapper = getWrapper();
      const datePicker = wrapper.find(DatePicker);
      expect(datePicker).to.have.length(1);
      expect(datePicker.prop('value')).to.equal(defaultProps.begin.input.value);
      expect(datePicker.prop('onChange')).to.equal(wrapper.instance().handleDateChange);
    });

    it('renders time control for changing reservation begin time', () => {
      const wrapper = getWrapper();
      const beginTimeControl = wrapper.find(FormControl).at(0);
      const expectedValue = moment(defaultProps.begin.input.value).format('HH:mm');
      expect(beginTimeControl).to.have.length(1);
      expect(beginTimeControl.prop('type')).to.equal('time');
      expect(beginTimeControl.prop('value')).to.equal(expectedValue);
      expect(beginTimeControl.prop('onChange')).to.equal(wrapper.instance().handleBeginTimeChange);
    });

    it('renders time control for changing reservation end time', () => {
      const wrapper = getWrapper();
      const endTimeControl = wrapper.find(FormControl).at(1);
      const expectedValue = moment(defaultProps.end.input.value).format('HH:mm');
      expect(endTimeControl).to.have.length(1);
      expect(endTimeControl.prop('type')).to.equal('time');
      expect(endTimeControl.prop('value')).to.equal(expectedValue);
      expect(endTimeControl.prop('onChange')).to.equal(wrapper.instance().handleEndTimeChange);
    });
  });

  describe('handleBeginTimeChange', () => {
    function callHandleBeginTimeChange(onChange, value) {
      const currentValue = moment('2017-01-01T10:00:00').toISOString();
      const props = {
        begin: { input: { onChange, value: currentValue } },
      };
      const wrapper = getWrapper(props);
      const mockEvent = { target: { value } };
      wrapper.instance().handleBeginTimeChange(mockEvent);
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
      const mockEvent = { target: { value } };
      wrapper.instance().handleEndTimeChange(mockEvent);
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

  describe('handleDateChange', () => {
    let props;
    const newDate = '2018-12-30';

    before(() => {
      props = {
        begin: {
          input: {
            onChange: simple.mock(),
            value: moment('2017-01-01T10:00:00').toISOString(),
          },
        },
        end: {
          input: {
            onChange: simple.mock(),
            value: moment('2017-01-01T11:30:00').toISOString(),
          },
        },
      };
      getWrapper(props).instance().handleDateChange(newDate);
    });

    it('calls begin.input.onChange with date updated in begin.input.value', () => {
      const expectedArg = moment('2018-12-30T10:00:00').toISOString();
      expect(props.begin.input.onChange.callCount).to.equal(1);
      expect(props.begin.input.onChange.lastCall.args).to.deep.equal([expectedArg]);
    });

    it('calls end.input.onChange with date updated in end.input.value', () => {
      const expectedArg = moment('2018-12-30T11:30:00').toISOString();
      expect(props.end.input.onChange.callCount).to.equal(1);
      expect(props.end.input.onChange.lastCall.args).to.deep.equal([expectedArg]);
    });
  });
});
