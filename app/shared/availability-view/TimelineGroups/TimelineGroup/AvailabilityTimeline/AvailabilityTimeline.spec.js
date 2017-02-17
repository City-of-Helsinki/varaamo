import { expect } from 'chai';
import { shallow } from 'enzyme';
import moment from 'moment';
import React from 'react';
import simple from 'simple-mock';

import AvailabilityTimeline from './AvailabilityTimeline';
import Reservation from './Reservation';
import ReservationSlot from './ReservationSlot';

function getWrapper(props) {
  const defaults = {
    id: 'resource-id',
    items: [],
  };
  return shallow(<AvailabilityTimeline {...defaults} {...props} />);
}

describe('shared/availability-view/AvailabilityTimeline', () => {
  it('renders a div.availability-timeline', () => {
    const wrapper = getWrapper();
    expect(wrapper.is('div.availability-timeline')).to.be.true;
  });

  it('renders given reservation slot', () => {
    const wrapper = getWrapper({
      items: [{
        key: '1',
        type: 'reservation-slot',
        data: { begin: moment(), end: moment(), resourceId: '' },
      }],
    });
    const slot = wrapper.find(ReservationSlot);
    expect(slot).to.have.length(1);
  });

  it('renders given reservation', () => {
    const wrapper = getWrapper({
      items: [{
        key: '1',
        type: 'reservation',
        data: {
          begin: '',
          end: '',
          id: 12345,
          name: 'My Reservation',
        },
      }],
    });
    const reservation = wrapper.find(Reservation);
    expect(reservation).to.have.length(1);
    expect(reservation.prop('name')).to.equal('My Reservation');
  });

  it('renders slots and reservations', () => {
    const wrapper = getWrapper({
      items: [
        {
          key: '1',
          type: 'reservation-slot',
          data: {
            begin: moment(),
            end: moment(),
            resourceId: '',
          },
        },
        { key: '2', type: 'reservation', data: { begin: '', end: '', id: 12345, name: '' } },
        {
          key: '3',
          type: 'reservation-slot',
          data: {
            begin: moment(),
            end: moment(),
            resourceId: '',
          },
        },
      ],
    });
    const children = wrapper.children();
    expect(children.at(0).is(ReservationSlot)).to.be.true;
    expect(children.at(1).is(Reservation)).to.be.true;
    expect(children.at(2).is(ReservationSlot)).to.be.true;
  });

  describe('handleReservationSlotClick', () => {
    it('is given to ReservationSlot components', () => {
      const wrapper = getWrapper({
        items: [
          {
            key: '1',
            type: 'reservation-slot',
            data: {
              begin: moment(),
              end: moment(),
              resourceId: '',
            },
          },
        ],
      });
      const slot = wrapper.find(ReservationSlot);
      expect(slot.prop('onClick')).to.equal(wrapper.instance().handleReservationSlotClick);
    });

    it('calls props.onReservationSlotClick with data and resource id', () => {
      const id = 'resource-id-test';
      const onReservationSlotClick = simple.mock();
      const wrapper = getWrapper({ id, onReservationSlotClick });
      wrapper.instance().handleReservationSlotClick({ some: 'data' });
      expect(onReservationSlotClick.callCount).to.equal(1);
      expect(onReservationSlotClick.lastCall.args).to.deep.equal([{
        some: 'data',
        resourceId: id,
      }]);
    });

    it('does not raise an error if no onReservationSlotClick in props', () => {
      const wrapper = getWrapper();
      wrapper.instance().handleReservationSlotClick({ some: 'data' });
    });
  });
});
