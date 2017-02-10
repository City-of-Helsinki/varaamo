import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';

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
});
