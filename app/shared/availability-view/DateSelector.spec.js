import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import simple from 'simple-mock';

import DatePicker from 'shared/date-picker';
import { UninjectedDateSelector as DateSelector } from './DateSelector';

function getWrapper(props) {
  const defaults = {
    value: '2016-11-01',
    onChange: () => null,
    t: s => s,
  };
  return shallow(<DateSelector {...defaults} {...props} />);
}

describe('shared/availability-view/DateSelector', () => {
  it('renders a div.date-selector', () => {
    const wrapper = getWrapper();
    expect(wrapper.is('div.date-selector')).to.be.true;
  });

  it('renders link to previous day', () => {
    const wrapper = getWrapper();
    const link = wrapper.find('.previous');
    expect(link).to.have.length(1);
    expect(link.prop('onClick')).to.equal(wrapper.instance().handlePreviousClick);
  });

  it('renders link to next day', () => {
    const wrapper = getWrapper();
    const link = wrapper.find('.next');
    expect(link).to.have.length(1);
    expect(link.prop('onClick')).to.equal(wrapper.instance().handleNextClick);
  });

  it('renders current value', () => {
    const value = '2016-11-28';
    const date = getWrapper({ value }).find('.current-value');
    expect(date).to.have.length(1);
  });

  it('renders a DatePicker', () => {
    const wrapper = getWrapper();
    const link = wrapper.find('.current-value').find(DatePicker);
    expect(link).to.have.length(1);
  });

  describe('DatePicker', () => {
    function getDatePickerWrapper(props) {
      return getWrapper(props).find('.current-value').find(DatePicker);
    }

    it('gets dateFormat prop', () => {
      expect(getDatePickerWrapper().prop('dateFormat')).to.equal('dd D.M.YYYY');
    });

    it('gets correct value', () => {
      const value = '2016-12-12';
      expect(getDatePickerWrapper({ value }).prop('value')).to.equal(value);
    });

    it('gets a onChange prop that uses onChange function', () => {
      const onChange = simple.mock();
      const value = '2016-12-12';
      const datePicker = getDatePickerWrapper({ onChange });
      expect(onChange.callCount).to.equal(0);
      datePicker.prop('onChange')(value);
      expect(onChange.callCount).to.equal(1);
      expect(onChange.lastCall.args[0]).to.equal(value);
    });
  });

  describe('handleNextClick', () => {
    it('calls onChange with next date', () => {
      const value = '2016-01-01';
      const onChange = simple.mock();
      const wrapper = getWrapper({ value, onChange });
      wrapper.instance().handleNextClick();
      expect(onChange.callCount).to.equal(1);
      const args = onChange.lastCall.args;
      expect(args).to.have.length(1);
      expect(args[0]).to.equal('2016-01-02');
    });
  });

  describe('handlePreviousClick', () => {
    it('calls onChange with previous date', () => {
      const value = '2016-01-01';
      const onChange = simple.mock();
      const wrapper = getWrapper({ value, onChange });
      wrapper.instance().handlePreviousClick();
      expect(onChange.callCount).to.equal(1);
      const args = onChange.lastCall.args;
      expect(args).to.have.length(1);
      expect(args[0]).to.equal('2015-12-31');
    });
  });
});
