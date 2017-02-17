import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';

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
  it('renders a div.timeline-groups', () => {
    const wrapper = getWrapper();
    expect(wrapper.is('div.timeline-groups')).to.be.true;
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
});
