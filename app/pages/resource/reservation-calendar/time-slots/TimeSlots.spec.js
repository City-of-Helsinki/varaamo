import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import Immutable from 'seamless-immutable';
import simple from 'simple-mock';

import Resource from 'utils/fixtures/Resource';
import TimeSlot from 'utils/fixtures/TimeSlot';
import TimeSlots from './TimeSlots';
import TimeSlotComponent from './TimeSlot';

describe('pages/resource/reservation-calendar/time-slots/TimeSlots', () => {
  const defaultSlots = [
    TimeSlot.build(),
    TimeSlot.build(),
  ];
  const defaultProps = {
    addNotification: simple.stub(),
    isAdmin: false,
    isEditing: false,
    isFetching: false,
    isLoggedIn: true,
    onClick: simple.stub(),
    resource: Resource.build(),
    selected: [defaultSlots[0].asISOString],
    slots: Immutable(defaultSlots),
  };

  function getWrapper(props) {
    return shallow(<TimeSlots {...defaultProps} {...props} />);
  }

  it('renders div.app-TimeSlots', () => {
    const div = getWrapper().find('div.app-TimeSlots');
    expect(div).to.have.length(1);
  });

  describe('rendering individual time slots', () => {
    function getTimeSlotsWrapper(props) {
      return getWrapper(props).find(TimeSlotComponent);
    }

    it('renders a TimeSlot component for every time slot in props', () => {
      expect(getTimeSlotsWrapper()).to.have.length(defaultProps.slots.length);
    });

    it('passes correct props to TimeSlots', () => {
      const timeSlots = getTimeSlotsWrapper();
      timeSlots.forEach((timeSlot, index) => {
        expect(timeSlot.props().addNotification).to.equal(defaultProps.addNotification);
        expect(timeSlot.props().isAdmin).to.equal(defaultProps.isAdmin);
        expect(timeSlot.props().isEditing).to.equal(defaultProps.isEditing);
        expect(timeSlot.props().isLoggedIn).to.equal(defaultProps.isLoggedIn);
        expect(timeSlot.props().isStaff).to.equal(defaultProps.isStaff);
        expect(timeSlot.props().onClick).to.equal(defaultProps.onClick);
        expect(timeSlot.props().resource).to.equal(defaultProps.resource);
        expect(timeSlot.props().slot).to.deep.equal(defaultProps.slots[index]);
      });
    });

    it('passes correct selected as a prop to TimeSlot', () => {
      const timeSlots = getTimeSlotsWrapper();
      expect(timeSlots.at(0).props().selected).to.equal(true);
      expect(timeSlots.at(1).props().selected).to.equal(false);
    });
  });
});
