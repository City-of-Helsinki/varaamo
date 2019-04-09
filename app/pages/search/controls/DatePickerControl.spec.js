import React from 'react';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import Overlay from 'react-bootstrap/lib/Overlay';
import DayPicker from 'react-day-picker';
import moment from 'moment';
import mockDate from 'mockdate';
import simple from 'simple-mock';

import { shallowWithIntl } from 'utils/testUtils';
import DatePickerControl from './DatePickerControl';
import SearchControlOverlay from './SearchControlOverlay';

const defaults = {
  currentLanguage: 'fi',
  date: '2017-01-01',
  duration: 30,
  end: '16:00',
  onConfirm: () => null,
  start: '10:00',
};
function getWrapper(props) {
  return shallowWithIntl(<DatePickerControl {...defaults} {...props} />);
}

describe('pages/search/controls/DatePickerControl', () => {
  test('renders a div.app-DatePickerControl', () => {
    const wrapper = getWrapper();
    expect(wrapper.is('div.app-DatePickerControl')).toBe(true);
  });

  test('renders ControlLabel with correct text', () => {
    const wrapper = getWrapper();
    const controlLabel = wrapper.find(ControlLabel);
    expect(controlLabel).toHaveLength(1);
  });

  test('renders FormGroup with correct props', () => {
    const wrapper = getWrapper();
    const instance = wrapper.instance();
    const formGroup = wrapper.find(FormGroup);
    expect(formGroup).toHaveLength(1);
    expect(formGroup.prop('onClick')).toBe(instance.showOverlay);
  });

  test('renders app-DatePickerControl__title with correct text', () => {
    const wrapper = getWrapper();
    const title = wrapper.find('.app-DatePickerControl__title');
    expect(title).toHaveLength(1);
  });

  test('renders Overlay with correct props', () => {
    const wrapper = getWrapper();
    const instance = wrapper.instance();
    const overlay = wrapper.find(Overlay);
    expect(overlay).toHaveLength(1);
    expect(overlay.prop('container')).toBe(instance);
    expect(overlay.prop('onHide')).toBe(instance.hideOverlay);
    expect(overlay.prop('placement')).toBe('bottom');
    expect(overlay.prop('rootClose')).toBe(true);
    expect(overlay.prop('show')).toBe(instance.state.visible);
  });

  test('renders SearchControlOverlay with correct props', () => {
    const wrapper = getWrapper();
    const controlOverlay = wrapper.find(SearchControlOverlay);
    expect(controlOverlay).toHaveLength(1);
    expect(controlOverlay.prop('onHide')).toBe(wrapper.instance().hideOverlay);
    expect(controlOverlay.prop('title')).toBe('DatePickerControl.header');
  });

  test('renders DayPicker for selecting date', () => {
    const expected = moment(defaults.date)
      .startOf('day')
      .toDate();
    const wrapper = getWrapper();
    const dayPicker = wrapper.find(DayPicker);
    expect(dayPicker).toHaveLength(1);
    expect(dayPicker.prop('disabledDays')).toBeDefined();
    expect(dayPicker.prop('showOutsideDays')).toBe(true);
    expect(dayPicker.prop('initialMonth')).toEqual(expected);
    expect(dayPicker.prop('locale')).toBe(defaults.currentLanguage);
    expect(dayPicker.prop('onDayClick')).toBe(wrapper.instance().handleConfirm);
    expect(dayPicker.prop('selectedDays')).toEqual(expected);
  });

  describe('DayPicker disabledDays', () => {
    const dayPicker = getWrapper().find(DayPicker);
    const now = new Date();
    const todayEarly = new Date();
    todayEarly.setHours(0, 1, 0, 0);
    const todayLate = new Date();
    todayLate.setHours(23, 0, 0, 0);
    const receivedToday = new Date(now);
    const receivedYesterday = new Date(now.valueOf() - 86400000);
    const receivedTomorrow = new Date(now.valueOf() + 86400000);
    receivedToday.setHours(12, 0, 0, 0);
    receivedTomorrow.setHours(12, 0, 0, 0);
    receivedYesterday.setHours(12, 0, 0, 0);
    let isDisabled;
    beforeAll(() => {
      isDisabled = dayPicker.prop('disabledDays');
    });

    afterEach(() => {
      mockDate.reset();
    });

    test('disables yesterday', () => {
      mockDate.set(now);
      expect(isDisabled(receivedYesterday)).toBe(true);
    });

    test('enables today now', () => {
      mockDate.set(now);
      expect(isDisabled(receivedToday)).toBe(false);
    });

    test('enables today early', () => {
      mockDate.set(todayEarly);
      expect(isDisabled(receivedToday)).toBe(false);
    });

    test('enables today late', () => {
      mockDate.set(todayLate);
      expect(isDisabled(receivedToday)).toBe(false);
    });

    test('enables tomorrow', () => {
      mockDate.set(now);
      expect(isDisabled(receivedTomorrow)).toBe(false);
    });
  });

  describe('handleConfirm', () => {
    test('calls onConfirm with correct value', () => {
      const onConfirm = simple.mock();
      const date = '12.12.2017';
      const expected = { date };
      const instance = getWrapper({ onConfirm }).instance();
      instance.handleConfirm(date);
      expect(onConfirm.callCount).toBe(1);
      expect(onConfirm.lastCall.args).toEqual([expected]);
    });

    test('calls hideOverlay', () => {
      const instance = getWrapper().instance();
      simple.mock(instance, 'hideOverlay');
      instance.handleConfirm();
      expect(instance.hideOverlay.callCount).toBe(1);
      simple.restore();
    });
  });

  describe('hideOverlay', () => {
    test('sets state.visible to false', () => {
      const instance = getWrapper().instance();
      instance.state.visible = true;
      instance.hideOverlay();
      expect(instance.state.visible).toBe(false);
    });
  });

  describe('showOverlay', () => {
    test('sets state.visible to true', () => {
      const instance = getWrapper().instance();
      instance.state.visible = false;
      instance.showOverlay();
      expect(instance.state.visible).toBe(true);
    });
  });
});
