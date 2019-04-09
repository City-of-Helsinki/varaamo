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
  test('renders a div.app-PositionControl', () => {
    const wrapper = getWrapper();
    expect(wrapper.is('div.app-PositionControl')).toBe(true);
  });

  test('renders a CheckboxControl with correct props', () => {
    const wrapper = getWrapper({ geolocated: true });
    const modal = wrapper.find(CheckboxControl);
    expect(modal).toHaveLength(1);
    expect(modal.prop('value')).toBe(true);
    expect(modal.prop('onConfirm')).toBe(wrapper.instance().handleToggleChange);
  });

  test('renders a slider with correct props if geolocation toggle is on', () => {
    const wrapper = getWrapper({ geolocated: true });
    const modal = wrapper.find('.app-PositionControl__distance_slider');
    expect(modal).toHaveLength(1);
    expect(modal.prop('disabled')).toBe(false);
    expect(modal.prop('max')).toBe(21000);
    expect(modal.prop('min')).toBe(1000);
    expect(modal.prop('onAfterChange')).toBe(wrapper.instance().handleConfirm);
    expect(modal.prop('onChange')).toBe(wrapper.instance().handleDistanceSliderChange);
    expect(modal.prop('step')).toBe(1000);
    expect(modal.prop('value')).toBe(21000);
  });

  test('does not render slider if geolocation toggle is off', () => {
    const wrapper = getWrapper();
    const modal = wrapper.find('.app-PositionControl__distance_slider');
    expect(modal).toHaveLength(0);
  });

  describe('handleConfirm', () => {
    test('calls onConfirm with correct value', () => {
      const onConfirm = simple.mock();
      const value = 100;
      const instance = getWrapper({ onConfirm }).instance();
      instance.handleConfirm(value);
      expect(onConfirm.callCount).toBe(1);
      expect(onConfirm.lastCall.args).toEqual([value]);
    });

    test(
      'calls onConfirm with empty string if value is bigger than maxDistance',
      () => {
        const onConfirm = simple.mock();
        const value = 100000;
        const instance = getWrapper({ onConfirm }).instance();
        instance.handleConfirm(value);
        expect(onConfirm.callCount).toBe(1);
        expect(onConfirm.lastCall.args).toEqual(['']);
      }
    );
  });

  describe('handleToggleChange', () => {
    test('calls onPositionSwitch', () => {
      const onPositionSwitch = simple.mock();
      const instance = getWrapper({ onPositionSwitch }).instance();
      instance.handleToggleChange(true);
      expect(onPositionSwitch.callCount).toBe(1);
    });

    test('sets toggled state', () => {
      const instance = getWrapper().instance();
      expect(instance.state.toggled).toBe(false);
      const value = true;
      instance.handleToggleChange(value);
      expect(instance.state.toggled).toBe(true);
    });
  });

  describe('handleDistanceSliderChange', () => {
    test('sets distance state', () => {
      const instance = getWrapper().instance();
      expect(instance.state.distance).toBe(21000);
      const value = 100;
      instance.handleDistanceSliderChange(value);
      expect(instance.state.distance).toBe(value);
    });
  });

  describe('distanceFormatter', () => {
    test('returns value and km', () => {
      const instance = getWrapper().instance();
      expect(instance.distanceFormatter(2000)).toBe('2 km');
    });

    test(
      'returns PositionControl.noDistanceLimit if distance is higher than maxDistance',
      () => {
        const instance = getWrapper().instance();
        expect(instance.distanceFormatter(999999)).toBe('PositionControl.noDistanceLimit');
      }
    );
  });
});
