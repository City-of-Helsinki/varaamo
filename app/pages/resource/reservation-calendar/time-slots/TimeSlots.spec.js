import { expect } from 'chai';
import React from 'react';
import Table from 'react-bootstrap/lib/Table';
import Immutable from 'seamless-immutable';
import simple from 'simple-mock';

import Resource from 'utils/fixtures/Resource';
import TimeSlot from 'utils/fixtures/TimeSlot';
import { shallowWithIntl } from 'utils/testUtils';
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
    isStaff: false,
    onClick: simple.stub(),
    resource: Resource.build(),
    selected: [defaultSlots[0].asISOString],
    slots: Immutable(defaultSlots),
  };

  function getWrapper(props) {
    return shallowWithIntl(<TimeSlots {...defaultProps} {...props} />);
  }

  it('renders a Table component', () => {
    const table = getWrapper().find(Table);
    expect(table.length).to.equal(1);
  });

  describe('table headers', () => {
    function getThsWrapper(props) {
      return getWrapper(props).find('th');
    }

    describe('if user is not an admin', () => {
      const isAdmin = false;

      it('renders 4 th elements', () => {
        expect(getThsWrapper({ isAdmin })).to.have.length(4);
      });

      it('first th element is empty', () => {
        expect(getThsWrapper({ isAdmin }).at(0).text()).to.equal('');
      });

      it('second th element contains correct text', () => {
        expect(getThsWrapper({ isAdmin }).at(1).text()).to.equal('TimeSlots.time');
      });

      it('third th element contains correct text', () => {
        expect(getThsWrapper({ isAdmin }).at(2).text()).to.equal('TimeSlots.reservations');
      });

      it('fourth th element is empty', () => {
        expect(getThsWrapper({ isAdmin }).at(3).text()).to.equal('');
      });
    });

    describe('if user is an admin', () => {
      const isAdmin = true;

      it('renders 6 th elements', () => {
        expect(getThsWrapper({ isAdmin })).to.have.length(6);
      });

      it('first th element is empty', () => {
        expect(getThsWrapper({ isAdmin }).at(0).text()).to.equal('');
      });

      it('second th element contains correct text', () => {
        expect(getThsWrapper({ isAdmin }).at(1).text()).to.equal('TimeSlots.time');
      });

      it('third th element contains correct text', () => {
        expect(getThsWrapper({ isAdmin }).at(2).text()).to.equal('TimeSlots.reservations');
      });

      it('fourth th element contains correct text', () => {
        expect(getThsWrapper({ isAdmin }).at(3).text()).to.equal('TimeSlots.reserver');
      });

      it('fifth th element contains correct text', () => {
        expect(getThsWrapper({ isAdmin }).at(4).text()).to.equal('TimeSlots.comments');
      });

      it('sixth th element contains correct text', () => {
        expect(getThsWrapper({ isAdmin }).at(5).text()).to.equal('TimeSlots.controls');
      });
    });
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
