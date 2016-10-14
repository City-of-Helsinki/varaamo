import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import Table from 'react-bootstrap/lib/Table';
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
    isStaff: false,
    onClick: simple.stub(),
    resource: Resource.build(),
    selected: [defaultSlots[0].asISOString],
    slots: Immutable(defaultSlots),
  };

  function getWrapper(extraProps) {
    return shallow(<TimeSlots {...defaultProps} {...extraProps} />);
  }

  describe('with timeslots', () => {
    let wrapper;

    before(() => {
      wrapper = getWrapper();
    });

    it('renders a Table component', () => {
      const table = wrapper.find(Table);

      expect(table.length).to.equal(1);
    });

    describe('table headers', () => {
      let tableHeaders;

      before(() => {
        tableHeaders = wrapper.find('th');
      });

      it('renders 4 th elements', () => {
        expect(tableHeaders.length).to.equal(4);
      });

      it('first th element is empty', () => {
        expect(tableHeaders.at(0).text()).to.equal('');
      });

      it('second th element contains text "Aika"', () => {
        expect(tableHeaders.at(1).text()).to.equal('Aika');
      });

      it('third th element contains text "Varaustilanne"', () => {
        expect(tableHeaders.at(2).text()).to.equal('Varaustilanne');
      });

      it('fourth th element is empty', () => {
        expect(tableHeaders.at(3).text()).to.equal('');
      });
    });

    describe('rendering individual time slots', () => {
      let timeSlots;

      before(() => {
        timeSlots = wrapper.find(TimeSlotComponent);
      });

      it('renders a TimeSlot component for every time slot in props', () => {
        expect(timeSlots.length).to.equal(defaultProps.slots.length);
      });

      it('passes correct props to TimeSlots', () => {
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
        expect(timeSlots.at(0).props().selected).to.equal(true);
        expect(timeSlots.at(1).props().selected).to.equal(false);
      });
    });
  });

  describe('without timeslots', () => {
    const slots = [];
    let wrapper;

    before(() => {
      wrapper = getWrapper({ slots });
    });

    it('renders a message telling the resource is not available for reservation', () => {
      const expected = 'Tila ei ole varattavissa tänä päivänä.';

      expect(wrapper.find('p').text()).to.equal(expected);
    });

    it('does not render a Table component', () => {
      const table = wrapper.find(Table);

      expect(table.length).to.equal(0);
    });
  });
});
