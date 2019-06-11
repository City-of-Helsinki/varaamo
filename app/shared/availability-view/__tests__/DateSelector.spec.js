import { shallow } from 'enzyme';
import React from 'react';
import simple from 'simple-mock';

import DatePicker from '../../date-picker';
import { UninjectedDateSelector as DateSelector } from '../DateSelector';

function getWrapper(props) {
  const defaults = {
    value: '2016-11-01',
    onChange: () => null,
    t: s => s,
  };
  return shallow(<DateSelector {...defaults} {...props} />);
}

describe('shared/availability-view/DateSelector', () => {
  test('renders a div.date-selector', () => {
    const wrapper = getWrapper();
    expect(wrapper.is('div.date-selector')).toBe(true);
  });

  test('renders link to previous day', () => {
    const wrapper = getWrapper();
    const link = wrapper.find('.previous');
    expect(link).toHaveLength(1);
    expect(link.prop('onClick')).toBe(wrapper.instance().handlePreviousClick);
  });

  test('renders link to next day', () => {
    const wrapper = getWrapper();
    const link = wrapper.find('.next');
    expect(link).toHaveLength(1);
    expect(link.prop('onClick')).toBe(wrapper.instance().handleNextClick);
  });

  test('renders current value', () => {
    const value = '2016-11-28';
    const date = getWrapper({ value }).find('.current-value');
    expect(date).toHaveLength(1);
  });

  test('renders a DatePicker', () => {
    const wrapper = getWrapper();
    const link = wrapper.find('.current-value').find(DatePicker);
    expect(link).toHaveLength(1);
  });

  describe('DatePicker', () => {
    function getDatePickerWrapper(props) {
      return getWrapper(props).find('.current-value').find(DatePicker);
    }

    test('gets dateFormat prop', () => {
      expect(getDatePickerWrapper().prop('dateFormat')).toBe('dd D.M.YYYY');
    });

    test('gets correct value', () => {
      const value = '2016-12-12';
      expect(getDatePickerWrapper({ value }).prop('value')).toBe(value);
    });

    test('gets a onChange prop that uses onChange function', () => {
      const onChange = simple.mock();
      const value = '2016-12-12';
      const datePicker = getDatePickerWrapper({ onChange });
      expect(onChange.callCount).toBe(0);
      datePicker.prop('onChange')(value);
      expect(onChange.callCount).toBe(1);
      expect(onChange.lastCall.args[0]).toBe(value);
    });
  });

  describe('handleNextClick', () => {
    test('calls onChange with next date', () => {
      const value = '2016-01-01';
      const onChange = simple.mock();
      const wrapper = getWrapper({ value, onChange });
      wrapper.instance().handleNextClick();
      expect(onChange.callCount).toBe(1);
      const args = onChange.lastCall.args;
      expect(args).toHaveLength(1);
      expect(args[0]).toBe('2016-01-02');
    });
  });

  describe('handlePreviousClick', () => {
    test('calls onChange with previous date', () => {
      const value = '2016-01-01';
      const onChange = simple.mock();
      const wrapper = getWrapper({ value, onChange });
      wrapper.instance().handlePreviousClick();
      expect(onChange.callCount).toBe(1);
      const args = onChange.lastCall.args;
      expect(args).toHaveLength(1);
      expect(args[0]).toBe('2015-12-31');
    });
  });
});
