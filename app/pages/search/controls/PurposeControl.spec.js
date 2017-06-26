import { expect } from 'chai';
import React from 'react';
import Select from 'react-select';
import simple from 'simple-mock';

import MiniModal from 'shared/mini-modal';
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

  it('renders MiniModal with correct theme', () => {
    const miniModal = getWrapper().find(MiniModal);
    expect(miniModal).to.have.length(1);
    expect(miniModal.prop('theme')).to.equal('blue');
  });

  it('renders Select with correct props', () => {
    const wrapper = getWrapper();
    const select = wrapper.find(Select);
    expect(select).to.have.length(1);
    expect(select.prop('onChange')).to.equal(wrapper.instance().handleChange);
  });

  describe('componentWillReceiveProps', () => {
    it('sets state.value to the nextProps.value', () => {
      const value = 'sports';
      const instance = getWrapper({ value }).instance();
      instance.componentWillReceiveProps({ value: 'meeting' });
      expect(instance.state.value).to.equal('meeting');
    });
  });

  describe('handleChange', () => {
    it('sets state.value to the new value', () => {
      const instance = getWrapper().instance();
      instance.state.value = 'sports';
      instance.handleChange({ value: 'meeting' });
      expect(instance.state.value).to.equal('meeting');
    });
  });

  describe('handleConfirm', () => {
    it('calls onConfirm with correct value', () => {
      const onConfirm = simple.mock();
      const value = 'meeting';
      const instance = getWrapper({ onConfirm }).instance();
      instance.state.value = value;
      instance.handleConfirm();
      expect(onConfirm.callCount).to.equal(1);
      expect(onConfirm.lastCall.args).to.deep.equal([value]);
    });
  });
});
