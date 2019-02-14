import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import simple from 'simple-mock';

import TimelineGroups from './TimelineGroups';
import TimelineGroup from './TimelineGroup';

function getWrapper(props) {
  const defaults = {
    date: '2016-01-01',
    groups: []
  };
  return shallow(<TimelineGroups {...defaults} {...props} />);
}

describe('shared/availability-view/TimelineGroups', () => {
  it('renders a div.timeline-groups', () => {
    const wrapper = getWrapper();
    const instance = wrapper.instance();
    expect(wrapper.is('div.timeline-groups')).to.be.true;
    expect(wrapper.prop('onScroll')).to.equal(instance.handleScroll);
  });

  it('renders no groups if none given', () => {
    const elements = getWrapper({ groups: [] }).find(TimelineGroup);
    expect(elements).to.have.length(0);
  });

  it('renders each group', () => {
    const groups = [{ name: 'A', resources: [] }, { name: 'B', resources: [] }];
    const elements = getWrapper({ groups }).find(TimelineGroup);
    expect(elements).to.have.length(2);
  });

  it('passes onReservationSlotClick to groups', () => {
    const groups = [{ name: 'A', resources: [] }];
    const onReservationSlotClick = () => null;
    const element = getWrapper({ groups, onReservationSlotClick }).find(TimelineGroup);
    expect(element).to.have.length(1);
    expect(element.prop('onReservationSlotClick')).to.equal(onReservationSlotClick);
  });

  it('passes onReservationSlotMouseEnter to groups', () => {
    const groups = [{ name: 'A', resources: [] }];
    const onReservationSlotMouseEnter = () => null;
    const element = getWrapper({ groups, onReservationSlotMouseEnter }).find(TimelineGroup);
    expect(element).to.have.length(1);
    expect(element.prop('onReservationSlotMouseEnter')).to.equal(onReservationSlotMouseEnter);
  });

  it('passes onReservationSlotMouseLeave to groups', () => {
    const groups = [{ name: 'A', resources: [] }];
    const onReservationSlotMouseLeave = () => null;
    const element = getWrapper({ groups, onReservationSlotMouseLeave }).find(TimelineGroup);
    expect(element).to.have.length(1);
    expect(element.prop('onReservationSlotMouseLeave')).to.equal(onReservationSlotMouseLeave);
  });

  it('passes selection to groups', () => {
    const selection = { some: 'data' };
    const groups = [{ name: 'A', resources: [] }];
    const group = getWrapper({ groups, selection }).find(TimelineGroup);
    expect(group.prop('selection')).to.equal(selection);
  });

  describe('componentDidMount', () => {
    before(() => {
      simple.mock(window, 'addEventListener');
    });

    after(() => {
      simple.restore();
    });

    it('adds a scroll event listener', () => {
      window.addEventListener.reset();
      const instance = getWrapper().instance();
      instance.componentDidMount();
      expect(window.addEventListener.callCount).to.equal(1);
      expect(window.addEventListener.lastCall.args).to.deep.equal(['scroll', instance.handleScroll]);
    });
  });

  describe('componentWillUnmount', () => {
    before(() => {
      simple.mock(window, 'removeEventListener');
    });

    after(() => {
      simple.restore();
    });

    it('removes the scroll event listener', () => {
      window.removeEventListener.reset();
      const instance = getWrapper().instance();
      instance.componentWillUnmount();
      expect(window.removeEventListener.callCount).to.equal(1);
      expect(window.removeEventListener.lastCall.args).to.deep.equal(['scroll', instance.handleScroll]);
    });
  });
});
