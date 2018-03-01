import { expect } from 'chai';
import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import Overlay from 'react-bootstrap/lib/Overlay';
import simple from 'simple-mock';
import Toggle from 'react-toggle';

import { shallowWithIntl } from 'utils/testUtils';
import PositionControl from './PositionControl';
import SearchControlOverlay from './SearchControlOverlay';

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

    it('has showOverlay as onClick prop', () => {
      const wrapper = getWrapper();
      const button = wrapper.find(Button);
      expect(button.prop('onClick')).to.equal(wrapper.instance().showOverlay);
    });
  });

  describe('Overlay', () => {
    it('renders Overlay with correct props', () => {
      const wrapper = getWrapper();
      const instance = wrapper.instance();
      const overlay = wrapper.find(Overlay);
      expect(overlay).to.have.length(1);
      expect(overlay.prop('container')).to.equal(instance);
      expect(overlay.prop('onHide')).to.equal(instance.hideOverlay);
      expect(overlay.prop('placement')).to.equal('bottom');
      expect(overlay.prop('rootClose')).to.be.true;
      expect(overlay.prop('show')).to.equal(instance.state.visible);
    });
  });

  describe('SearchControlOverlay', () => {
    it('renders SearchControlOverlay with correct props', () => {
      const wrapper = getWrapper();
      const controlOverlay = wrapper.find(SearchControlOverlay);
      expect(controlOverlay).to.have.length(1);
      expect(controlOverlay.prop('onHide')).to.equal(wrapper.instance().hideOverlay);
      expect(controlOverlay.prop('title')).to.equal('PositionControl.header');
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
      expect(modal.prop('min')).to.equal(1000);
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

    it('calls hideOverlay', () => {
      const instance = getWrapper().instance();
      simple.mock(instance, 'hideOverlay');
      instance.handleConfirm();
      expect(instance.hideOverlay.callCount).to.equal(1);
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

  describe('hideOverlay', () => {
    it('sets state.visible to false', () => {
      const instance = getWrapper().instance();
      instance.state.visible = true;
      instance.hideOverlay();
      expect(instance.state.visible).to.be.false;
    });
  });

  describe('showOverlay', () => {
    it('sets state.visible to true', () => {
      const instance = getWrapper().instance();
      instance.state.visible = false;
      instance.showOverlay();
      expect(instance.state.visible).to.be.true;
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
