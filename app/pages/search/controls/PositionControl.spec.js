import { expect } from 'chai';
import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import Modal from 'react-bootstrap/lib/Modal';
import simple from 'simple-mock';
import Toggle from 'react-toggle';

import { shallowWithIntl } from 'utils/testUtils';
import PositionControl from './PositionControl';

function getWrapper(props) {
  const defaults = {
    geolocated: false,
    onPositionSwitch: () => null,
    onConfirm: () => null,
    t: () => {},
  };
  return shallowWithIntl(<PositionControl {...defaults} {...props} />);
}

describe('pages/search/controls/PositionControl', () => {
  it('renders a div.app-PositionControl', () => {
    const wrapper = getWrapper();
    expect(wrapper.is('div.app-PositionControl')).to.be.true;
  });

  describe('Button', () => {
    it('does not have active class if not geolocated', () => {
      const button = getWrapper({ geolocated: false }).find(Button);
      expect(button.prop('className')).to.not.contain('active');
    });

    it('has active class if geolocated', () => {
      const button = getWrapper({ geolocated: true }).find(Button);
      expect(button.prop('className')).to.contain('active');
    });

    it('has showModal as onClick prop', () => {
      const wrapper = getWrapper();
      const button = wrapper.find(Button);
      expect(button.prop('onClick')).to.equal(wrapper.instance().showModal);
    });
  });

  describe('Modal', () => {
    it('is rendered with correct props', () => {
      const wrapper = getWrapper();
      const modal = wrapper.find(Modal);
      expect(modal).to.have.length(1);
      expect(modal.prop('onHide')).to.equal(wrapper.instance().hideModal);
      expect(modal.prop('show')).to.equal(wrapper.instance().state.visible);
    });

    it('renders a Toggle with correct props', () => {
      const wrapper = getWrapper({ geolocated: true });
      const modal = wrapper.find(Toggle);
      expect(modal).to.have.length(1);
      expect(modal.prop('defaultChecked')).to.be.true;
      expect(modal.prop('onChange')).to.equal(wrapper.instance().handleToggleChange);
    });

    it('renders a slider with correct props if geolocation toggle is on', () => {
      const wrapper = getWrapper({ geolocated: true });
      const modal = wrapper.find('.app-PositionControl__distance_slider');
      expect(modal).to.have.length(1);
      expect(modal.prop('disabled')).to.be.false;
      expect(modal.prop('max')).to.equal(21000);
      expect(modal.prop('min')).to.equal(0);
      expect(modal.prop('onAfterChange')).to.equal(wrapper.instance().handleConfirm);
      expect(modal.prop('onChange')).to.equal(wrapper.instance().handleDistanceSliderChange);
      expect(modal.prop('step')).to.equal(1000);
      expect(modal.prop('value')).to.equal(21000);
    });

    it('renders a disabled slider if geolocation toggle is off', () => {
      const wrapper = getWrapper();
      const modal = wrapper.find('.app-PositionControl__distance_slider');
      expect(modal).to.have.length(1);
      expect(modal.prop('disabled')).to.be.true;
    });
  });

  describe('handleConfirm', () => {
    it('calls onConfirm with correct value', () => {
      const onConfirm = simple.mock();
      const value = 100;
      const instance = getWrapper({ onConfirm }).instance();
      instance.handleConfirm(value);
      expect(onConfirm.callCount).to.equal(1);
      expect(onConfirm.lastCall.args).to.deep.equal([value]);
    });

    it('calls onConfirm with empty string if value is bigger than maxDistance', () => {
      const onConfirm = simple.mock();
      const value = 100000;
      const instance = getWrapper({ onConfirm }).instance();
      instance.handleConfirm(value);
      expect(onConfirm.callCount).to.equal(1);
      expect(onConfirm.lastCall.args).to.deep.equal(['']);
    });

    it('calls hideModal', () => {
      const instance = getWrapper().instance();
      simple.mock(instance, 'hideModal');
      instance.handleConfirm();
      expect(instance.hideModal.callCount).to.equal(1);
      simple.restore();
    });
  });

  describe('handleToggleChange', () => {
    it('calls onPositionSwitch', () => {
      const onPositionSwitch = simple.mock();
      const value = { target: { checked: true } };
      const instance = getWrapper({ onPositionSwitch }).instance();
      instance.handleToggleChange(value);
      expect(onPositionSwitch.callCount).to.equal(1);
      expect(onPositionSwitch.lastCall.args).to.deep.equal([value]);
    });

    it('sets toggled state', () => {
      const instance = getWrapper().instance();
      expect(instance.state.toggled).to.be.false;
      const value = { target: { checked: true } };
      instance.handleToggleChange(value);
      expect(instance.state.toggled).to.be.true;
    });
  });

  describe('handleDistanceSliderChange', () => {
    it('sets distance state', () => {
      const instance = getWrapper().instance();
      expect(instance.state.distance).to.equal(21000);
      const value = 100;
      instance.handleDistanceSliderChange(value);
      expect(instance.state.distance).to.equal(value);
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
