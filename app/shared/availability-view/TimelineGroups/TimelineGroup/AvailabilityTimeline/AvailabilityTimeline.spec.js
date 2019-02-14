import { expect } from 'chai';
import { shallow } from 'enzyme';
import moment from 'moment';
import React from 'react';

import AvailabilityTimeline from './AvailabilityTimeline';
import Reservation from './Reservation';
import ReservationSlot from './ReservationSlot';

function getWrapper(props) {
  const defaults = {
    id: 'resource-id',
    items: []
  };
  return shallow(<AvailabilityTimeline {...defaults} {...props} />);
}

describe('shared/availability-view/AvailabilityTimeline', () => {
  it('renders a div.availability-timeline', () => {
    const wrapper = getWrapper();
    expect(wrapper.is('div.availability-timeline')).to.be.true;
  });

  it('renders given reservation slot', () => {
    const id = 'resource-auuxnane';
    const onReservationSlotClick = () => null;
    const onReservationSlotMouseEnter = () => null;
    const onReservationSlotMouseLeave = () => null;
    const wrapper = getWrapper({
      id,
      items: [{
        key: '1',
        type: 'reservation-slot',
        data: { begin: moment().format(), end: moment().format(), resourceId: '' }
      }],
      onReservationSlotClick,
      onReservationSlotMouseEnter,
      onReservationSlotMouseLeave
    });
    const slot = wrapper.find(ReservationSlot);
    expect(slot).to.have.length(1);
    expect(slot.prop('resourceId')).to.equal(id);
    expect(slot.prop('onClick')).to.equal(onReservationSlotClick);
    expect(slot.prop('onMouseEnter')).to.equal(onReservationSlotMouseEnter);
    expect(slot.prop('onMouseLeave')).to.equal(onReservationSlotMouseLeave);
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
          name: 'My Reservation'
        }
      }]
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
            begin: moment().format(),
            end: moment().format(),
            resourceId: ''
          }
        },
        {
          key: '2',
          type: 'reservation',
          data: {
            begin: '', end: '', id: 12345, name: ''
          }
        },
        {
          key: '3',
          type: 'reservation-slot',
          data: {
            begin: moment().format(),
            end: moment().format(),
            resourceId: ''
          }
        }
      ]
    });
    const children = wrapper.children();
    expect(children.at(0).is(ReservationSlot)).to.be.true;
    expect(children.at(1).is(Reservation)).to.be.true;
    expect(children.at(2).is(ReservationSlot)).to.be.true;
  });
});
