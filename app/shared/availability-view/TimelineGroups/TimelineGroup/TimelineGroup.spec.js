import { expect } from 'chai';
import { shallow } from 'enzyme';
import mockDate from 'mockdate';
import moment from 'moment';
import React from 'react';
import simple from 'simple-mock';

import { slotSize, slotWidth } from 'shared/availability-view';
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
  it('renders a div.timeline-group', () => {
    const wrapper = getWrapper();
    expect(wrapper.is('div.timeline-group')).to.be.true;
  });

  it('renders hours', () => {
    const hours = getWrapper().find('.hour');
    expect(hours).to.have.length(24);
    const texts = hours.map(hour => hour.text());
    expect(texts).to.deep.equal([
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
    it('is .hour-start-selected if end time is XX:30', () => {
      const selection = {
        begin: '2016-01-01T00:00:00',
        end: '2016-01-01T01:30:00',
      };
      const hours = getWrapper({ selection }).find('.hour');
      const hour = hours.at(1);
      expect(hour.is('.hour-start-selected')).to.be.true;
      expect(hour.is('.hour-end-selected')).to.be.false;
    });

    it('is .hour-end-selected if end time is XX:00', () => {
      const selection = {
        begin: '2016-01-01T00:00:00',
        end: '2016-01-01T02:00:00',
      };
      const hours = getWrapper({ selection }).find('.hour');
      const hour = hours.at(1);
      expect(hour.is('.hour-start-selected')).to.be.false;
      expect(hour.is('.hour-end-selected')).to.be.true;
    });
  });

  it('renders no resources if none given', () => {
    const wrapper = getWrapper({ resources: [] });
    const resources = wrapper.find(AvailabilityTimelineContainer);
    expect(resources).to.have.length(0);
  });

  it('renders resources', () => {
    const resources = ['1234', '5678', '90ab', 'cdef'];
    const wrapper = getWrapper({ resources });
    const elements = wrapper.find(AvailabilityTimelineContainer);
    expect(elements).to.have.length(4);
    expect(elements.at(0).prop('id')).to.equal(resources[0]);
    expect(elements.at(1).prop('id')).to.equal(resources[1]);
    expect(elements.at(2).prop('id')).to.equal(resources[2]);
    expect(elements.at(3).prop('id')).to.equal(resources[3]);
  });

  describe('componentDidMount', () => {
    beforeAll(() => {
      simple.mock(window, 'setInterval');
    });

    afterAll(() => {
      simple.restore();
    });

    it('starts interval', () => {
      const interval = {};
      window.setInterval.reset();
      window.setInterval.returnWith(interval);
      const instance = getWrapper().instance();
      instance.componentDidMount();
      expect(window.setInterval.callCount).to.equal(1);
      expect(window.setInterval.lastCall.args).to.deep.equal([instance.updateTime, 60000]);
      expect(instance.updateTimeInterval).to.equal(interval);
    });
  });

  describe('componentWillUnmount', () => {
    beforeAll(() => {
      simple.mock(window, 'clearInterval');
    });

    afterAll(() => {
      simple.restore();
    });

    it('clears interval', () => {
      const interval = { some: 'data' };
      window.clearInterval.reset();
      const instance = getWrapper().instance();
      instance.updateTimeInterval = interval;
      instance.componentWillUnmount();
      expect(window.clearInterval.callCount).to.equal(1);
      expect(window.clearInterval.lastCall.args).to.deep.equal([interval]);
      expect(instance.updateTimeInterval).to.be.null;
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

    it('returns null if date is before current date', () => {
      const offset = getOffset('2017-01-01', '2017-01-02T10:00:00');
      expect(offset).to.be.null;
    });

    it('returns null if date is after current date', () => {
      const offset = getOffset('2017-01-03', '2017-01-02T10:00:00');
      expect(offset).to.be.null;
    });

    it('returns 0 if currently at the beginning of the day', () => {
      const offset = getOffset('2017-01-02', '2017-01-02T00:00:00');
      expect(offset).to.equal(0);
    });

    it('returns correct value if during day', () => {
      const offset = getOffset('2017-01-02', '2017-01-02T12:32:00');
      const minutes = (12 * 60) + 32;
      const expected = (minutes / slotSize) * slotWidth;
      expect(offset).to.equal(expected);
    });
  });
});
