import { expect } from 'chai';
import React from 'react';
import NumericInput from 'react-numeric-input';
import simple from 'simple-mock';

import MiniModal from 'shared/mini-modal';
import { shallowWithIntl } from 'utils/testUtils';
import PeopleCapacityControl from './PeopleCapacityControl';

function getWrapper(props) {
  const defaults = {
    onConfirm: () => null,
    value: 5,
  };
  return shallowWithIntl(<PeopleCapacityControl {...defaults} {...props} />);
}

describe('pages/search/controls/PeopleCapacityControl', () => {
  it('renders a div.app-PeopleCapacityControl', () => {
    const wrapper = getWrapper();
    expect(wrapper.is('div.app-PeopleCapacityControl')).to.be.true;
  });

  it('renders MiniModal with correct theme', () => {
    const miniModal = getWrapper().find(MiniModal);
    expect(miniModal).to.have.length(1);
    expect(miniModal.prop('theme')).to.equal('orange');
  });

  it('renders numeric input for selecting number of people', () => {
    const onChange = () => null;
    const wrapper = getWrapper({ onChange });
    const numericInput = wrapper.find(NumericInput);
    expect(numericInput).to.have.length(1);
    expect(numericInput.prop('onChange')).to.equal(wrapper.instance().handleChange);
  });

  describe('componentWillReceiveProps', () => {
    it('sets state.value to the nextProps.value', () => {
      const value = 9;
      const instance = getWrapper({ value }).instance();
      instance.componentWillReceiveProps({ value: 12 });
      expect(instance.state.value).to.equal(12);
    });
  });

  describe('handleChange', () => {
    it('sets state.value to the new value', () => {
      const instance = getWrapper().instance();
      instance.state.value = 9;
      instance.handleChange(12);
      expect(instance.state.value).to.equal(12);
    });
  });

  describe('handleConfirm', () => {
    it('calls onConfirm with correct value', () => {
      const onConfirm = simple.mock();
      const value = 12;
      const instance = getWrapper({ onConfirm }).instance();
      instance.state.value = value;
      instance.handleConfirm();
      expect(onConfirm.callCount).to.equal(1);
      expect(onConfirm.lastCall.args).to.deep.equal([value]);
    });
  });
});
