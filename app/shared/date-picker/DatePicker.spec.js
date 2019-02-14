import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import { DateField, DatePicker as RDPDatePicker } from 'react-date-picker';
import simple from 'simple-mock';

import DatePicker from './DatePicker';

function getWrapper(props) {
  const defaults = {
    onChange: () => null,
    value: '2016-12-12'
  };
  return shallow(<DatePicker {...defaults} {...props} />);
}

describe('shared/date-picker/DatePicker', () => {
  describe('DateField', () => {
    function getDateFieldWrapper(props) {
      return getWrapper(props).find(DateField);
    }

    it('is rendered', () => {
      expect(getDateFieldWrapper()).to.have.length(1);
    });

    it('has value in localized date format', () => {
      const value = '2016-12-12';
      const expected = '12.12.2016';
      expect(getDateFieldWrapper({ value }).prop('value')).to.equal(expected);
    });

    it('has value custom date format', () => {
      const dateFormat = 'YYYY.MM.DD';
      const value = '2016-12-12';
      const expected = '2016.12.12';
      expect(getDateFieldWrapper({ dateFormat, value }).prop('value')).to.equal(expected);
    });

    it('changing date calls onChange with date in correct format', () => {
      const onChange = simple.mock();
      const dateField = getDateFieldWrapper({ onChange });
      const newDate = '12.12.2016';
      const expectedDate = '2016-12-12';
      dateField.prop('onChange')(newDate);
      expect(onChange.callCount).to.equal(1);
      expect(onChange.lastCall.arg).to.deep.equal(expectedDate);
    });
  });

  it('renders a react-date-picker DatePicker', () => {
    const datePicker = getWrapper().find(RDPDatePicker);
    expect(datePicker).to.have.length(1);
  });
});
