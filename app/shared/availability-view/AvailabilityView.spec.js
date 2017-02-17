import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';

import DateSelector from './DateSelector';
import TimelineGroups from './TimelineGroups';
import AvailabilityView from './AvailabilityView';
import Sidebar from './Sidebar';

function getWrapper(props) {
  const defaults = {
    date: '2016-01-01',
    groups: [],
    onDateChange: () => null,
  };
  return shallow(<AvailabilityView {...defaults} {...props} />);
}

describe('shared/availability-view/AvailabilityView', () => {
  it('renders a div.availability-view', () => {
    const wrapper = getWrapper();
    expect(wrapper.is('div.availability-view')).to.be.true;
  });

  it('renders DateSelector', () => {
    const date = '2016-11-12';
    const onDateChange = () => null;
    const element = getWrapper({ date, onDateChange }).find(DateSelector);
    expect(element).to.have.length(1);
    expect(element.prop('value')).to.equal(date);
    expect(element.prop('onChange')).to.equal(onDateChange);
  });

  it('renders Sidebar', () => {
    const date = '2016-11-12';
    const groups = [];
    const element = getWrapper({ date, groups }).find(Sidebar);
    expect(element).to.have.length(1);
    expect(element.prop('date')).to.equal(date);
    expect(element.prop('groups')).to.equal(groups);
  });

  it('renders TimelineGroups', () => {
    const date = '2016-11-12';
    const groups = [];
    const element = getWrapper({ date, groups }).find(TimelineGroups);
    expect(element).to.have.length(1);
    expect(element.prop('date')).to.equal(date);
    expect(element.prop('groups')).to.equal(groups);
  });

  it('has correct initial state', () => {
    const wrapper = getWrapper();
    expect(wrapper.state()).to.deep.equal({ selection: null });
  });

  describe('handleReservationSlotClick', () => {
    function handleReservationSlotClick(slot) {
      const wrapper = getWrapper();
      wrapper.instance().handleReservationSlotClick(slot);
      return wrapper.state();
    }

    it('is given to TimelineGroups', () => {
      const wrapper = getWrapper();
      const groups = wrapper.find(TimelineGroups);
      const handler = wrapper.instance().handleReservationSlotClick;
      expect(groups.prop('onReservationSlotClick')).to.equal(handler);
    });

    it('adds selection', () => {
      const begin = '2017-01-01';
      const resourceId = 'ab872ced93e1ee';
      const state = handleReservationSlotClick({ begin, resourceId, other: 'data' });
      expect(state).to.deep.equal({ selection: { begin, resourceId } });
    });
  });
});
