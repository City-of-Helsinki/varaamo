import { shallow } from 'enzyme';
import moment from 'moment';
import React from 'react';
import simple from 'simple-mock';

import SelectControl from '../../../pages/search/controls/SelectControl';
import DatePicker from '../../date-picker/DatePicker';
import ReservationTimeControls from '../ReservationTimeControls';

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
    test('renders div.reservation-time-controls', () => {
      expect(getWrapper().find('div.reservation-time-controls')).toHaveLength(1);
    });

    test('renders DatePicker with correct props', () => {
      const wrapper = getWrapper();
      const datePicker = wrapper.find(DatePicker);
      expect(datePicker).toHaveLength(1);
      expect(datePicker.prop('value')).toBe(defaultProps.begin.input.value);
      expect(datePicker.prop('onChange')).toBe(wrapper.instance().handleDateChange);
    });

    test('renders Select for changing reservation begin time', () => {
      const wrapper = getWrapper();
      const beginTimeControl = wrapper.find(SelectControl).at(0);
      const expectedValue = moment(defaultProps.begin.input.value).format('HH:mm');
      expect(beginTimeControl).toHaveLength(1);
      expect(beginTimeControl.prop('value')).toBe(expectedValue);
      expect(beginTimeControl.prop('onChange')).toBe(wrapper.instance().handleBeginTimeChange);
      expect(beginTimeControl.prop('options')).toEqual(wrapper.instance().getTimeOptions());
    });

    test('renders time Select for changing reservation end time', () => {
      const wrapper = getWrapper();
      const endTimeControl = wrapper.find(SelectControl).at(1);
      const expectedValue = moment(defaultProps.end.input.value).format('HH:mm');
      expect(endTimeControl).toHaveLength(1);
      expect(endTimeControl.prop('value')).toBe(expectedValue);
      expect(endTimeControl.prop('onChange')).toBe(wrapper.instance().handleEndTimeChange);
      expect(endTimeControl.prop('options')).toEqual(wrapper.instance().getTimeOptions());
    });
  });

  describe('getTimeOptions', () => {
    const timeToNumber = (time) => {
      const [hours, minutes] = time.split(':');

      return Number(hours + minutes);
    };
    const optionsToNumber = options => options.map(({ value }) => timeToNumber(value));

    test(
      'returns time options using props.period as the duration between times ',
      () => {
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
        expect(options).toEqual(expected);
      },
    );

    test('when constraints.startTime is set, time options before startTime won\'t be listed', () => {
      const startTime = '10:00';
      const wrapper = getWrapper({ constraints: { startTime } });
      const options = wrapper.instance().getTimeOptions();

      expect(optionsToNumber(options).filter(option => option < timeToNumber(startTime)).length).toEqual(0);
    });

    test('when constraints.endTime is set, time options after endTime won\'t be listed', () => {
      const endTime = '17:00';
      const wrapper = getWrapper({ constraints: { endTime } });
      const options = wrapper.instance().getTimeOptions();

      expect(optionsToNumber(options).filter(option => option > timeToNumber(endTime)).length).toEqual(0);
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
      test(
        'calls begin.input.onChange with time updated in begin.input.value',
        () => {
          const onChange = simple.mock();
          const value = '15:30';
          const expectedArg = moment('2017-01-01T15:30:00').toISOString();
          callHandleBeginTimeChange(onChange, value);
          expect(onChange.callCount).toBe(1);
          expect(onChange.lastCall.args).toEqual([expectedArg]);
        },
      );
    });

    describe('with empty time value', () => {
      test('does not call begin.input.onChange', () => {
        const onChange = simple.mock();
        const value = '';
        callHandleBeginTimeChange(onChange, value);
        expect(onChange.callCount).toBe(0);
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
      test('calls end.input.onChange with time updated in end.input.value', () => {
        const onChange = simple.mock();
        const value = '18:00';
        const expectedArg = moment('2017-01-01T18:00:00').toISOString();
        callHandleEndTimeChange(onChange, value);
        expect(onChange.callCount).toBe(1);
        expect(onChange.lastCall.args).toEqual([expectedArg]);
      });
    });

    describe('with empty time value', () => {
      test('does not call end.input.onChange', () => {
        const onChange = simple.mock();
        const value = '';
        callHandleEndTimeChange(onChange, value);
        expect(onChange.callCount).toBe(0);
      });
    });
  });

  describe('handleDateChange', () => {
    let props;
    const newDate = '2018-12-30';

    beforeAll(() => {
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

    test(
      'calls begin.input.onChange with date updated in begin.input.value',
      () => {
        const expectedArg = moment('2018-12-30T10:00:00').toISOString();
        expect(props.begin.input.onChange.callCount).toBe(1);
        expect(props.begin.input.onChange.lastCall.args).toEqual([expectedArg]);
      },
    );

    test('calls end.input.onChange with date updated in end.input.value', () => {
      const expectedArg = moment('2018-12-30T11:30:00').toISOString();
      expect(props.end.input.onChange.callCount).toBe(1);
      expect(props.end.input.onChange.lastCall.args).toEqual([expectedArg]);
    });
  });
});
