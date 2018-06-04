import { expect } from 'chai';
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
  it('renders a div.app-DatePickerControl', () => {
    const wrapper = getWrapper();
    expect(wrapper.is('div.app-DatePickerControl')).to.be.true;
  });

  it('renders ControlLabel with correct text', () => {
    const wrapper = getWrapper();
    const controlLabel = wrapper.find(ControlLabel);
    expect(controlLabel).to.have.length(1);
  });

  it('renders FormGroup with correct props', () => {
    const wrapper = getWrapper();
    const instance = wrapper.instance();
    const formGroup = wrapper.find(FormGroup);
    expect(formGroup).to.have.length(1);
    expect(formGroup.prop('onClick')).to.equal(instance.showOverlay);
  });

  it('renders app-DatePickerControl__title with correct text', () => {
    const wrapper = getWrapper();
    const title = wrapper.find('.app-DatePickerControl__title');
    expect(title).to.have.length(1);
  });

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

  it('renders SearchControlOverlay with correct props', () => {
    const wrapper = getWrapper();
    const controlOverlay = wrapper.find(SearchControlOverlay);
    expect(controlOverlay).to.have.length(1);
    expect(controlOverlay.prop('onHide')).to.equal(wrapper.instance().hideOverlay);
    expect(controlOverlay.prop('title')).to.equal('DatePickerControl.header');
  });

  it('renders DayPicker for selecting date', () => {
    const expected = moment(defaults.date).startOf('day').toDate();
    const wrapper = getWrapper();
    const dayPicker = wrapper.find(DayPicker);
    expect(dayPicker).to.have.length(1);
    expect(dayPicker.prop('disabledDays')).to.exist;
    expect(dayPicker.prop('enableOutsideDays')).to.be.true;
    expect(dayPicker.prop('initialMonth')).to.deep.equal(expected);
    expect(dayPicker.prop('locale')).to.equal(defaults.currentLanguage);
    expect(dayPicker.prop('onDayClick')).to.equal(wrapper.instance().handleConfirm);
    expect(dayPicker.prop('selectedDays')).to.deep.equal(expected);
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
    before(() => {
      isDisabled = dayPicker.prop('disabledDays');
    });

    afterEach(() => {
      mockDate.reset();
    });

    it('disables yesterday', () => {
      mockDate.set(now);
      expect(isDisabled(receivedYesterday)).to.be.true;
    });

    it('enables today now', () => {
      mockDate.set(now);
      expect(isDisabled(receivedToday)).to.be.false;
    });

    it('enables today early', () => {
      mockDate.set(todayEarly);
      expect(isDisabled(receivedToday)).to.be.false;
    });

    it('enables today late', () => {
      mockDate.set(todayLate);
      expect(isDisabled(receivedToday)).to.be.false;
    });

    it('enables tomorrow', () => {
      mockDate.set(now);
      expect(isDisabled(receivedTomorrow)).to.be.false;
    });
  });

  describe('componentWillUpdate', () => {
    it('updates state with correct values', () => {
      const duration = 90;
      const end = '15:00';
      const start = '11:00';
      const instance = getWrapper().instance();
      instance.componentWillUpdate({ duration, end, start });
      expect(instance.state.duration).to.equal(duration);
      expect(instance.state.end).to.equal(end);
      expect(instance.state.start).to.equal(start);
    });
  });

  describe('handleConfirm', () => {
    it('calls onConfirm with correct value', () => {
      const onConfirm = simple.mock();
      const date = '12.12.2017';
      const { duration, end, start } = defaults;
      const expected = { date, duration, end, start };
      const instance = getWrapper({ onConfirm }).instance();
      instance.handleConfirm(date);
      expect(onConfirm.callCount).to.equal(1);
      expect(onConfirm.lastCall.args).to.deep.equal([expected]);
    });

    it('calls hideOverlay', () => {
      const instance = getWrapper().instance();
      simple.mock(instance, 'hideOverlay');
      instance.handleConfirm();
      expect(instance.hideOverlay.callCount).to.equal(1);
      simple.restore();
    });
  });

  describe('handleTimeRange', () => {
    it('calls onConfirm with correct value', () => {
      const onConfirm = simple.mock();
      const { date } = defaults;
      const duration = 60;
      const end = '18:00';
      const start = '10:00';
      const props = { duration, end, start };
      const expected = { ...props, date };
      const instance = getWrapper({ onConfirm }).instance();
      instance.state.visible = true;
      instance.handleTimeRange(props);

      expect(onConfirm.callCount).to.equal(1);
      expect(onConfirm.lastCall.args).to.deep.equal([expected]);
      expect(instance.state.duration).to.equal(duration);
      expect(instance.state.end).to.equal(end);
      expect(instance.state.start).to.equal(start);
      expect(instance.state.visible).to.be.false;
    });

    it('calls onConfirm with correct end value when start is after end', () => {
      const onConfirm = simple.mock();
      const { date } = defaults;
      const duration = 30;
      const end = '09:00';
      const start = '10:00';
      const expectedEnd = '10:30';
      const props = { duration, end, start };
      const expected = { ...props, date, end: expectedEnd };
      const instance = getWrapper({ onConfirm }).instance();
      instance.handleTimeRange(props);

      expect(onConfirm.callCount).to.equal(1);
      expect(onConfirm.lastCall.args).to.deep.equal([expected]);
      expect(instance.state.end).to.equal(expectedEnd);
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
});
