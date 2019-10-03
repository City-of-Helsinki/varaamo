import { shallow } from 'enzyme';
import React from 'react';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import simple from 'simple-mock';

import { UnconnectedDatePicker as DatePicker } from '../DatePicker';

function getWrapper(props) {
  const defaults = {
    onChange: () => null,
    value: '2016-12-12',
  };
  return shallow(<DatePicker {...defaults} {...props} />);
}

describe('shared/date-picker/DatePicker', () => {
  describe('DateField', () => {
    function getDateFieldWrapper(props) {
      return getWrapper(props).find(DayPickerInput);
    }

    test('is rendered', () => {
      expect(getDateFieldWrapper()).toHaveLength(1);
    });

    test('changing date calls onDayChange with date in correct format', () => {
      const onChange = simple.mock();
      const dateField = getDateFieldWrapper({ onChange });
      const newDate = '2011-10-05T14:48:00.000Z';
      const expectedDate = '2011-10-05';
      dateField.prop('onDayChange')(newDate);
      expect(onChange.callCount).toBe(1);
      expect(onChange.lastCall.arg).toBe(expectedDate);
    });

    test('have default locale prop', () => {
      const defaultLocale = 'fi';
      const dateField = getDateFieldWrapper();

      expect(dateField.prop('dayPickerProps').locale).toEqual(defaultLocale);
    });

    test('have locale prop passed from redux state', () => {
      const mockLocale = 'sv';
      const dateField = getDateFieldWrapper({ currentLocale: mockLocale });

      expect(dateField.prop('dayPickerProps').locale).toEqual(mockLocale);
    });
  });
});
