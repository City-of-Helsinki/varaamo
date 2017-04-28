import { expect } from 'chai';
import { shallow } from 'enzyme';
import moment from 'moment';
import React from 'react';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import DayPicker from 'react-day-picker';

import DatePicker from './DatePicker';

const defaults = {
  dayPickerClassName: 'dayPickerClassName',
  inputClassName: 'inputClassName',
  onChange: () => null,
  value: '2016-12-12',
};
function getWrapper(props) {
  return shallow(<DatePicker {...defaults} {...props} />);
}

describe('shared/date-picker/DatePicker', () => {
  it('is rendered with date-picker class', () => {
    expect(getWrapper().prop('className')).to.equal('date-picker');
  });

  it('adds class form-control if prop is passed', () => {
    expect(getWrapper({ formControl: true }).prop('className')).to.include('form-control');
  });

  describe('input', () => {
    it('is rendered with correct props', () => {
      const wrapper = getWrapper();
      const instance = wrapper.instance();
      const input = wrapper.find('input');
      expect(input.prop('className')).to.equal('inputClassName');
      expect(input.prop('onBlur')).to.equal(instance.handleInputBlur);
      expect(input.prop('onFocus')).to.equal(instance.handleInputFocus);
      expect(input.prop('placeholder')).to.equal('DD/MM/YYYY');
      expect(input.prop('readOnly')).to.be.true;
      expect(input.prop('type')).to.equal('text');
      expect(input.prop('value')).to.equal(moment(defaults.value).format('L'));
    });

    it('has value in localized date format', () => {
      const value = '2016-12-12';
      expect(getWrapper({ value }).find('input').prop('value')).to.equal(moment(value).format('L'));
    });

    it('has value custom date format', () => {
      const dateFormat = 'YYYY.MM.DD';
      const value = '2016-12-12';
      const expected = '2016.12.12';
      expect(getWrapper({ dateFormat, value }).find('input').prop('value')).to.equal(expected);
    });
  });

  describe('DayPicker', () => {
    function getDayPickerWrapper(props) {
      return getWrapper(props).setState({ showOverlay: true }).find(DayPicker);
    }

    it('is not rendered if showOverlay state is false', () => {
      expect(getWrapper().find(DayPicker)).to.have.length(0);
    });

    it('is rendered if showOverlay state is true', () => {
      expect(getDayPickerWrapper().find(DayPicker)).to.have.length(1);
    });

    it('is rendered with correct props', () => {
      const wrapper = getWrapper();
      const instance = wrapper.instance();
      wrapper.setState({ showOverlay: true });
      const dayPickerWrapper = wrapper.find(DayPicker);
      const selectedDay = new Date();
      selectedDay.setFullYear(2016, 11, 12);
      expect(dayPickerWrapper.prop('className')).to.equal('dayPickerClassName');
      expect(dayPickerWrapper.prop('initialMonth').setHours(0, 0, 0, 0)).to.deep.equal(
        selectedDay.setHours(0, 0, 0, 0)
      );
      expect(dayPickerWrapper.prop('onDayClick')).to.equal(instance.handleDayClick);
      expect(dayPickerWrapper.prop('selectedDays').setHours(0, 0, 0, 0)).to.deep.equal(
        selectedDay.setHours(0, 0, 0, 0)
      );
    });
  });
  describe('icon', () => {
    it('is not rendered if showOverlay state is false', () => {
      expect(getWrapper().find(Glyphicon)).to.have.length(0);
    });

    it('is rendered if showOverlay state is true', () => {
      const wrapper = getWrapper({ icon: 'calendar' }).find(Glyphicon);
      expect(wrapper).to.have.length(1);
      expect(wrapper.prop('glyph')).to.equal('calendar');
    });
  });
});
