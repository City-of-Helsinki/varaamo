import { shallow } from 'enzyme';
import React from 'react';
import simple from 'simple-mock';

import TimelineGroups from './TimelineGroups';
import TimelineGroup from './TimelineGroup';

function getWrapper(props) {
  const defaults = {
    date: '2016-01-01',
    groups: [],
  };
  return shallow(<TimelineGroups {...defaults} {...props} />);
}

describe('shared/availability-view/TimelineGroups', () => {
  test('renders a div.timeline-groups', () => {
    const wrapper = getWrapper();
    const instance = wrapper.instance();
    expect(wrapper.is('div.timeline-groups')).toBe(true);
    expect(wrapper.prop('onScroll')).toBe(instance.handleScroll);
  });

  test('renders no groups if none given', () => {
    const elements = getWrapper({ groups: [] }).find(TimelineGroup);
    expect(elements).toHaveLength(0);
  });

  test('renders each group', () => {
    const groups = [{ name: 'A', resources: [] }, { name: 'B', resources: [] }];
    const elements = getWrapper({ groups }).find(TimelineGroup);
    expect(elements).toHaveLength(2);
  });

  test('passes onReservationSlotClick to groups', () => {
    const groups = [{ name: 'A', resources: [] }];
    const onReservationSlotClick = () => null;
    const element = getWrapper({ groups, onReservationSlotClick }).find(TimelineGroup);
    expect(element).toHaveLength(1);
    expect(element.prop('onReservationSlotClick')).toBe(onReservationSlotClick);
  });

  test('passes onReservationSlotMouseEnter to groups', () => {
    const groups = [{ name: 'A', resources: [] }];
    const onReservationSlotMouseEnter = () => null;
    const element = getWrapper({ groups, onReservationSlotMouseEnter }).find(TimelineGroup);
    expect(element).toHaveLength(1);
    expect(element.prop('onReservationSlotMouseEnter')).toBe(onReservationSlotMouseEnter);
  });

  test('passes onReservationSlotMouseLeave to groups', () => {
    const groups = [{ name: 'A', resources: [] }];
    const onReservationSlotMouseLeave = () => null;
    const element = getWrapper({ groups, onReservationSlotMouseLeave }).find(TimelineGroup);
    expect(element).toHaveLength(1);
    expect(element.prop('onReservationSlotMouseLeave')).toBe(onReservationSlotMouseLeave);
  });

  test('passes selection to groups', () => {
    const selection = { some: 'data' };
    const groups = [{ name: 'A', resources: [] }];
    const group = getWrapper({ groups, selection }).find(TimelineGroup);
    expect(group.prop('selection')).toBe(selection);
  });

  describe('componentDidMount', () => {
    beforeAll(() => {
      simple.mock(window, 'addEventListener');
    });

    afterAll(() => {
      simple.restore();
    });

    test('adds a scroll event listener', () => {
      window.addEventListener.reset();
      const instance = getWrapper().instance();
      instance.componentDidMount();
      expect(window.addEventListener.callCount).toBe(1);
      expect(window.addEventListener.lastCall.args).toEqual(['scroll', instance.handleScroll]);
    });
  });

  describe('componentWillUnmount', () => {
    beforeAll(() => {
      simple.mock(window, 'removeEventListener');
    });

    afterAll(() => {
      simple.restore();
    });

    test('removes the scroll event listener', () => {
      window.removeEventListener.reset();
      const instance = getWrapper().instance();
      instance.componentWillUnmount();
      expect(window.removeEventListener.callCount).toBe(1);
      expect(window.removeEventListener.lastCall.args).toEqual(['scroll', instance.handleScroll]);
    });
  });
});
