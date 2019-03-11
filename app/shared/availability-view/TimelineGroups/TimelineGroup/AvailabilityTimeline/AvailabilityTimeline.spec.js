import { shallow } from 'enzyme';
import moment from 'moment';
import React from 'react';

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
  test('renders a div.availability-timeline', () => {
    const wrapper = getWrapper();
    expect(wrapper.is('div.availability-timeline')).toBe(true);
  });

  test('renders given reservation slot', () => {
    const id = 'resource-auuxnane';
    const onReservationSlotClick = () => null;
    const onReservationSlotMouseEnter = () => null;
    const onReservationSlotMouseLeave = () => null;
    const wrapper = getWrapper({
      id,
      items: [{
        key: '1',
        type: 'reservation-slot',
        data: { begin: moment().format(), end: moment().format(), resourceId: '' },
      }],
      onReservationSlotClick,
      onReservationSlotMouseEnter,
      onReservationSlotMouseLeave,
    });
    const slot = wrapper.find(ReservationSlot);
    expect(slot).toHaveLength(1);
    expect(slot.prop('resourceId')).toBe(id);
    expect(slot.prop('onClick')).toBe(onReservationSlotClick);
    expect(slot.prop('onMouseEnter')).toBe(onReservationSlotMouseEnter);
    expect(slot.prop('onMouseLeave')).toBe(onReservationSlotMouseLeave);
  });

  test('renders given reservation', () => {
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
    expect(reservation).toHaveLength(1);
    expect(reservation.prop('name')).toBe('My Reservation');
  });

  test('renders slots and reservations', () => {
    const wrapper = getWrapper({
      items: [
        {
          key: '1',
          type: 'reservation-slot',
          data: {
            begin: moment().format(),
            end: moment().format(),
            resourceId: '',
          },
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
            resourceId: '',
          },
        },
      ],
    });
    const children = wrapper.children();
    expect(children.at(0).is(ReservationSlot)).toBe(true);
    expect(children.at(1).is(Reservation)).toBe(true);
    expect(children.at(2).is(ReservationSlot)).toBe(true);
  });
});
