import { expect } from 'chai';
import React from 'react';
import Modal from 'react-bootstrap/lib/Modal';
import Select from 'react-select';
import simple from 'simple-mock';

import { shallowWithIntl } from 'utils/testUtils';
import PurposeControl from './PurposeControl';

function getWrapper(props) {
  const defaults = {
    isLoading: false,
    onConfirm: () => null,
    purposeOptions: [],
    value: '',
  };
  return shallowWithIntl(<PurposeControl {...defaults} {...props} />);
}

describe('pages/search/controls/PurposeControl', () => {
  it('renders a div.app-PurposeControl', () => {
    const wrapper = getWrapper();
    expect(wrapper.is('div.app-PurposeControl')).to.be.true;
  });

  it('renders Select with correct props', () => {
    const wrapper = getWrapper();
    const select = wrapper.find(Select);
    expect(select).to.have.length(1);
    expect(select.prop('onChange')).to.equal(wrapper.instance().handleConfirm);
  });

  it('renders Modal with correct props', () => {
    const wrapper = getWrapper();
    const modal = wrapper.find(Modal);
    expect(modal).to.have.length(1);
    expect(modal.prop('onHide')).to.equal(wrapper.instance().hideModal);
    expect(modal.prop('show')).to.equal(wrapper.instance().state.visible);
  });

  describe('handleConfirm', () => {
    it('calls onConfirm with correct value', () => {
      const onConfirm = simple.mock();
      const option = { value: 'meeting' };
      const instance = getWrapper({ onConfirm }).instance();
      instance.handleConfirm(option);
      expect(onConfirm.callCount).to.equal(1);
      expect(onConfirm.lastCall.args).to.deep.equal([option.value]);
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
