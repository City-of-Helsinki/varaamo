import { shallow } from 'enzyme';
import moment from 'moment';
import React from 'react';
import simple from 'simple-mock';

import SelectControl from '../../../pages/search/controls/SelectControl';
import TimeControls from '../TimeControls';

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
  };

  function getWrapper(props) {
    return shallow(<TimeControls {...defaultProps} {...props} />);
  }

  describe('render', () => {
    test('renders div.app-TimeControls', () => {
      expect(getWrapper().find('div.app-TimeControls')).toHaveLength(1);
    });

    test('renders Select for changing reservation begin time', () => {
      const wrapper = getWrapper();
      const beginTimeControl = wrapper.find(SelectControl).at(0);
      const expectedValue = moment(defaultProps.begin.input.value).format('HH:mm');
      expect(beginTimeControl).toHaveLength(1);
      expect(beginTimeControl.prop('value')).toBe(expectedValue);
      expect(beginTimeControl.prop('onChange')).toBe(wrapper.instance().handleBeginTimeChange);
      expect(beginTimeControl.prop('options')).toEqual(wrapper.instance().getBeginTimeOptions());
    });

    test('renders time Select for changing reservation end time', () => {
      const wrapper = getWrapper();
      const endTimeControl = wrapper.find(SelectControl).at(1);
      const expectedValue = moment(defaultProps.end.input.value).format('HH:mm');
      expect(endTimeControl).toHaveLength(1);
      expect(endTimeControl.prop('value')).toBe(expectedValue);
      expect(endTimeControl.prop('onChange')).toBe(wrapper.instance().handleEndTimeChange);
      expect(endTimeControl.prop('options')).toEqual(wrapper.instance().getEndTimeOptions());
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
      test(
        'calls begin.input.onChange with time updated in begin.input.value',
        () => {
          const onChange = simple.mock();
          const props = {
            begin: { input: { onChange, value: '2017-01-01T10:00:00+02:00' } },
          };
          const value = '15:30';
          const expectedArg = moment('2017-01-01T15:30:00').toISOString();
          callHandleBeginTimeChange(props, value);
          expect(onChange.callCount).toBe(1);
          expect(onChange.lastCall.args).toEqual([expectedArg]);
        }
      );

      test(
        'calls end.input.onChange with correct value if old end time is no longer valid',
        () => {
          const onChange = simple.mock();
          const currentEndValue = moment('2017-01-01T10:00:00').toISOString();
          const props = {
            end: { input: { onChange, value: currentEndValue } },
          };
          const value = '15:30';
          callHandleBeginTimeChange(props, value);
          const expectedArg = moment('2017-01-01T16:00:00').toISOString();
          expect(onChange.callCount).toBe(1);
          expect(onChange.lastCall.args).toEqual([expectedArg]);
        }
      );

      test('does not call end.input.onChange if old end time is still valid', () => {
        const onChange = simple.mock();
        const currentEndValue = moment('2017-01-01T16:30:00').toISOString();
        const props = {
          end: { input: { onChange, value: currentEndValue } },
        };
        const value = '15:30';
        callHandleBeginTimeChange(props, value);
        expect(onChange.callCount).toBe(0);
      });
    });

    describe('with empty time value', () => {
      test('does not call begin.input.onChange', () => {
        const onChange = simple.mock();
        const props = {
          begin: { input: { onChange, value: '2017-01-01T10:00:00+02:00' } },
        };
        const value = '';
        callHandleBeginTimeChange(props, value);
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
});
