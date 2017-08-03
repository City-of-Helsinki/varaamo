import { expect } from 'chai';
import React from 'react';
import Modal from 'react-bootstrap/lib/Modal';
import { Calendar } from 'react-date-picker';
import simple from 'simple-mock';

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

  it('renders Modal with correct props', () => {
    const wrapper = getWrapper();
    const modal = wrapper.find(Modal);
    expect(modal).to.have.length(1);
    expect(modal.prop('onHide')).to.equal(wrapper.instance().hideModal);
    expect(modal.prop('show')).to.equal(wrapper.instance().state.visible);
  });

  it('renders calendar for selecting date', () => {
    const wrapper = getWrapper();
    const calendar = wrapper.find(Calendar);
    expect(calendar).to.have.length(1);
    expect(calendar.prop('dateFormat')).to.equal('L');
    expect(calendar.prop('defaultDate')).to.equal(defaults.value);
    expect(calendar.prop('onChange')).to.equal(wrapper.instance().handleConfirm);
  });

  describe('handleConfirm', () => {
    it('calls onConfirm with correct value', () => {
      const onConfirm = simple.mock();
      const value = '12.12.2017';
      const instance = getWrapper({ onConfirm }).instance();
      instance.handleConfirm(value);
      expect(onConfirm.callCount).to.equal(1);
      expect(onConfirm.lastCall.args).to.deep.equal([value]);
    });

    it('calls hideModal', () => {
      const instance = getWrapper().instance();
      simple.mock(instance, 'hideModal');
      instance.handleConfirm();
      expect(instance.hideModal.callCount).to.equal(1);
      simple.restore();
    });
  });

  describe('hideModal', () => {
    it('sets state.visible to false', () => {
      const instance = getWrapper().instance();
      instance.state.visible = true;
      instance.hideModal();
      expect(instance.state.visible).to.be.false;
    });
  });

  describe('showModal', () => {
    it('sets state.visible to true', () => {
      const instance = getWrapper().instance();
      instance.state.visible = false;
      instance.showModal();
      expect(instance.state.visible).to.be.true;
    });
  });
});
