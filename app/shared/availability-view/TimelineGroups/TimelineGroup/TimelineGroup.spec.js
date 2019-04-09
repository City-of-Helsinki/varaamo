import { slotSize, slotWidth } from 'constants/SlotConstants';

import { shallow } from 'enzyme';
import mockDate from 'mockdate';
import moment from 'moment';
import React from 'react';
import simple from 'simple-mock';

import TimelineGroup from './TimelineGroup';
import AvailabilityTimelineContainer from './AvailabilityTimeline';

function getWrapper(props) {
  const defaults = {
    date: '2016-01-01T00:00:00',
    resources: [],
  };
  return shallow(<TimelineGroup {...defaults} {...props} />);
}

describe('shared/availability-view/TimelineGroup', () => {
  test('renders a div.timeline-group', () => {
    const wrapper = getWrapper();
    expect(wrapper.is('div.timeline-group')).toBe(true);
  });

  test('renders hours', () => {
    const hours = getWrapper().find('.hour');
    expect(hours).toHaveLength(24);
    const texts = hours.map(hour => hour.text());
    expect(texts).toEqual([
      '00:00',
      '01:00',
      '02:00',
      '03:00',
      '04:00',
      '05:00',
      '06:00',
      '07:00',
      '08:00',
      '09:00',
      '10:00',
      '11:00',
      '12:00',
      '13:00',
      '14:00',
      '15:00',
      '16:00',
      '17:00',
      '18:00',
      '19:00',
      '20:00',
      '21:00',
      '22:00',
      '23:00',
    ]);
  });

  describe('end hour of selection', () => {
    test('is .hour-start-selected if end time is XX:30', () => {
      const selection = {
        begin: '2016-01-01T00:00:00',
        end: '2016-01-01T01:30:00',
      };
      const hours = getWrapper({ selection }).find('.hour');
      const hour = hours.at(1);
      expect(hour.is('.hour-start-selected')).toBe(true);
      expect(hour.is('.hour-end-selected')).toBe(false);
    });

    test('is .hour-end-selected if end time is XX:00', () => {
      const selection = {
        begin: '2016-01-01T00:00:00',
        end: '2016-01-01T02:00:00',
      };
      const hours = getWrapper({ selection }).find('.hour');
      const hour = hours.at(1);
      expect(hour.is('.hour-start-selected')).toBe(false);
      expect(hour.is('.hour-end-selected')).toBe(true);
    });
  });

  test('renders no resources if none given', () => {
    const wrapper = getWrapper({ resources: [] });
    const resources = wrapper.find(AvailabilityTimelineContainer);
    expect(resources).toHaveLength(0);
  });

  test('renders resources', () => {
    const resources = ['1234', '5678', '90ab', 'cdef'];
    const wrapper = getWrapper({ resources });
    const elements = wrapper.find(AvailabilityTimelineContainer);
    expect(elements).toHaveLength(4);
    expect(elements.at(0).prop('id')).toBe(resources[0]);
    expect(elements.at(1).prop('id')).toBe(resources[1]);
    expect(elements.at(2).prop('id')).toBe(resources[2]);
    expect(elements.at(3).prop('id')).toBe(resources[3]);
  });

  describe('componentDidMount', () => {
    beforeAll(() => {
      simple.mock(window, 'setInterval');
    });

    afterAll(() => {
      simple.restore();
    });

    test('starts interval', () => {
      const interval = {};
      window.setInterval.reset();
      window.setInterval.returnWith(interval);
      const instance = getWrapper().instance();
      instance.componentDidMount();
      expect(window.setInterval.callCount).toBe(1);
      expect(window.setInterval.lastCall.args).toEqual([instance.updateTime, 60000]);
      expect(instance.updateTimeInterval).toBe(interval);
    });
  });

  describe('componentWillUnmount', () => {
    beforeAll(() => {
      simple.mock(window, 'clearInterval');
    });

    afterAll(() => {
      simple.restore();
    });

    test('clears interval', () => {
      const interval = { some: 'data' };
      window.clearInterval.reset();
      const instance = getWrapper().instance();
      instance.updateTimeInterval = interval;
      instance.componentWillUnmount();
      expect(window.clearInterval.callCount).toBe(1);
      expect(window.clearInterval.lastCall.args).toEqual([interval]);
      expect(instance.updateTimeInterval).toBeNull();
    });
  });

  describe('getTimeOffset', () => {
    function getOffset(date, now) {
      mockDate.set(moment(now).format());
      const instance = getWrapper({ date }).instance();
      return instance.getTimeOffset();
    }

    afterEach(() => {
      mockDate.reset();
    });

    test('returns null if date is before current date', () => {
      const offset = getOffset('2017-01-01', '2017-01-02T10:00:00');
      expect(offset).toBeNull();
    });

    test('returns null if date is after current date', () => {
      const offset = getOffset('2017-01-03', '2017-01-02T10:00:00');
      expect(offset).toBeNull();
    });

    test('returns 0 if currently at the beginning of the day', () => {
      const offset = getOffset('2017-01-02', '2017-01-02T00:00:00');
      expect(offset).toBe(0);
    });

    test('returns correct value if during day', () => {
      const offset = getOffset('2017-01-02', '2017-01-02T12:32:00');
      const minutes = (12 * 60) + 32;
      const expected = (minutes / slotSize) * slotWidth;
      expect(offset).toBe(expected);
    });
  });
});
