import React from 'react';
import NumericInput from 'react-numeric-input';
import simple from 'simple-mock';

import DatePicker from '../../date-picker/DatePicker';
import { shallowWithIntl } from '../../../utils/testUtils';
import SelectControl from '../../../pages/search/controls/SelectControl';
import {
  UnconnectedRecurringReservationControls as
  RecurringReservationControls,
} from '../RecurringReservationControls';

function getWrapper(props) {
  const defaults = {
    changeFrequency: () => null,
    changeNumberOfOccurrences: () => null,
    changeLastTime: () => null,
    frequency: 'days',
    frequencyOptions: [{ label: '', value: '' }],
    isVisible: true,
    isAdmin: true,
    lastTime: null,
    numberOfOccurrences: 1,
  };
  return shallowWithIntl(<RecurringReservationControls {...defaults} {...props} />);
}

describe('shared/RecurringReservationControls/RecurringReservationControls', () => {
  test('renders an empty span if isVisible is false', () => {
    const wrapper = getWrapper({ isVisible: false });
    expect(wrapper.equals(<span />)).toBe(true);
  });

  test('renders Select with correct props', () => {
    const props = {
      changeFrequency: () => null,
      frequency: 'days',
      frequencyOptions: [{ label: '', value: '' }],
      lastTime: '2017-04-09',
    };
    const select = getWrapper(props).find(SelectControl);
    expect(select).toHaveLength(1);
    expect(select.prop('onChange')).toBe(props.changeFrequency);
    expect(select.prop('options')).toBe(props.frequencyOptions);
    expect(select.prop('value')).toBe(props.frequency);
  });

  test('renders NumericInput to change number of occurrences', () => {
    const props = {
      changeNumberOfOccurrences: () => null,
      lastTime: '2017-04-09',
      numberOfOccurrences: 12,
    };
    const control = getWrapper(props).find(NumericInput);
    expect(control).toHaveLength(1);
    expect(control.prop('min')).toBe(1);
    expect(control.prop('value')).toBe(props.numberOfOccurrences);
    expect(control.prop('onChange')).toBe(props.changeNumberOfOccurrences);
  });

  test('renders DatePicker with correct props', () => {
    const props = {
      lastTime: '2017-04-09',
      numberOfOccurrences: 12,
      changeLastTime: simple.mock(),
    };
    const control = getWrapper(props).find(DatePicker);
    expect(control).toHaveLength(1);
    expect(control.prop('dateFormat')).toBe('D.M.YYYY');
    expect(control.prop('onChange')).toBe(props.changeLastTime);
    expect(control.prop('value')).toBe(props.lastTime);
  });

  describe('without set frecuency', () => {
    let wrapper;
    beforeAll(() => {
      wrapper = getWrapper({ frequency: '' });
    });

    test('does not render numbrerOfOcurrences NumericInput', () => {
      expect(wrapper.find(NumericInput)).toHaveLength(0);
    });

    test('does not render DatePicker', () => {
      expect(wrapper.find(DatePicker)).toHaveLength(0);
    });
  });

  describe('has recurring select option', () => {
    test('translated', () => {
      const arg = 'foo';
      const tMock = simple.mock();

      const wrapper = getWrapper({ frequency: '' });
      wrapper.setProps({ t: tMock });
      const getOptionLabel = wrapper.find(SelectControl).prop('getOptionLabel');
      getOptionLabel({ label: arg });

      expect(tMock.lastCall.arg).toBe(arg);
    });
  });
});
