import { expect } from 'chai';
import React from 'react';
import { Calendar } from 'react-date-picker';
import simple from 'simple-mock';

import MiniModal from 'shared/mini-modal';
import { shallowWithIntl } from 'utils/testUtils';
import DatePickerControl from './DatePickerControl';

const defaults = {
  onConfirm: () => null,
  value: '01.01.2017',
};
function getWrapper(props) {
  return shallowWithIntl(<DatePickerControl {...defaults} {...props} />);
}

describe('pages/search/controls/DatePickerControl', () => {
  it('renders a div.app-DatePickerControl', () => {
    const wrapper = getWrapper();
    expect(wrapper.is('div.app-DatePickerControl')).to.be.true;
  });

  it('renders MiniModal with correct theme', () => {
    const miniModal = getWrapper().find(MiniModal);
    expect(miniModal).to.have.length(1);
    expect(miniModal.prop('theme')).to.equal('green');
  });

  it('renders calendar for selecting date', () => {
    const wrapper = getWrapper();
    const calendar = wrapper.find(Calendar);
    expect(calendar).to.have.length(1);
    expect(calendar.prop('dateFormat')).to.equal('L');
    expect(calendar.prop('defaultDate')).to.equal(defaults.value);
    expect(calendar.prop('onChange')).to.equal(wrapper.instance().handleChange);
  });

  describe('componentWillReceiveProps', () => {
    it('sets state.value to the nextProps.value', () => {
      const value = '28.06.2017';
      const instance = getWrapper({ value }).instance();
      instance.componentWillReceiveProps({ value: '01.01.2017' });
      expect(instance.state.value).to.equal('01.01.2017');
    });
  });

  describe('handleChange', () => {
    it('sets state.value to the new value', () => {
      const instance = getWrapper().instance();
      instance.state.value = '28.06.2017';
      instance.handleChange('01.01.2017');
      expect(instance.state.value).to.equal('01.01.2017');
    });
  });

  describe('handleConfirm', () => {
    it('calls onConfirm with correct value', () => {
      const onConfirm = simple.mock();
      const value = '01.01.2017';
      const instance = getWrapper({ onConfirm }).instance();
      instance.state.value = value;
      instance.handleConfirm();
      expect(onConfirm.callCount).to.equal(1);
      expect(onConfirm.lastCall.args).to.deep.equal([value]);
    });
  });
});
