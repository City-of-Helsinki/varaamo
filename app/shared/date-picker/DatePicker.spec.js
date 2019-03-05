import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import simple from 'simple-mock';

import DatePicker from './DatePicker';

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

    it('is rendered', () => {
      expect(getDateFieldWrapper()).to.have.length(1);
    });

    it('changing date calls onDayChange with date in correct format', () => {
      const onChange = simple.mock();
      const dateField = getDateFieldWrapper({ onChange });
      const newDate = 'Tue Mar 05 2019';
      const expectedDate = '2019-03-05';
      dateField.prop('onDayChange')(newDate);
      expect(onChange.callCount).to.equal(1);
      expect(onChange.lastCall.arg).to.equal(expectedDate);
    });
  });
});
