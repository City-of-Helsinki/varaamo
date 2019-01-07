import { expect } from 'chai';
import React from 'react';
import simple from 'simple-mock';

import { shallowWithIntl } from 'utils/testUtils';
import PositionControl from './PositionControl';
import CheckboxControl from './CheckboxControl';

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

  it('renders a CheckboxControl with correct props', () => {
    const wrapper = getWrapper({ geolocated: true });
    const modal = wrapper.find(CheckboxControl);
    expect(modal).to.have.length(1);
    expect(modal.prop('value')).to.be.true;
    expect(modal.prop('onConfirm')).to.equal(wrapper.instance().handleToggleChange);
  });

  it('renders a slider with correct props if geolocation toggle is on', () => {
    const wrapper = getWrapper({ geolocated: true });
    const modal = wrapper.find('.app-PositionControl__distance_slider');
    expect(modal).to.have.length(1);
    expect(modal.prop('disabled')).to.be.false;
    expect(modal.prop('max')).to.equal(21000);
    expect(modal.prop('min')).to.equal(1000);
    expect(modal.prop('onAfterChange')).to.equal(wrapper.instance().handleConfirm);
    expect(modal.prop('onChange')).to.equal(wrapper.instance().handleDistanceSliderChange);
    expect(modal.prop('step')).to.equal(1000);
    expect(modal.prop('value')).to.equal(21000);
  });

  it('does not render slider if geolocation toggle is off', () => {
    const wrapper = getWrapper();
    const modal = wrapper.find('.app-PositionControl__distance_slider');
    expect(modal).to.have.length(0);
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
  });

  describe('handleToggleChange', () => {
    it('calls onPositionSwitch', () => {
      const onPositionSwitch = simple.mock();
      const instance = getWrapper({ onPositionSwitch }).instance();
      instance.handleToggleChange(true);
      expect(onPositionSwitch.callCount).to.equal(1);
    });

    it('sets toggled state', () => {
      const instance = getWrapper().instance();
      expect(instance.state.toggled).to.be.false;
      const value = true;
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

  describe('distanceFormatter', () => {
    it('returns value and km', () => {
      const instance = getWrapper().instance();
      expect(instance.distanceFormatter(2000)).to.equal('2 km');
    });

    it('returns PositionControl.noDistanceLimit if distance is higher than maxDistance', () => {
      const instance = getWrapper().instance();
      expect(instance.distanceFormatter(999999)).to.equal('PositionControl.noDistanceLimit');
    });
  });
});
