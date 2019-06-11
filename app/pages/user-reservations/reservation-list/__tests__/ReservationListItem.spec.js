import React from 'react';
import Immutable from 'seamless-immutable';

import ReservationStateLabel from '../../../../shared/reservation-state-label';
import TimeRange from '../../../../shared/time-range';
import Image from '../../../../utils/fixtures/Image';
import Reservation from '../../../../utils/fixtures/Reservation';
import Resource from '../../../../utils/fixtures/Resource';
import Unit from '../../../../utils/fixtures/Unit';
import ReservationControls from '../../../../shared/reservation-controls';
import { getResourcePageUrl } from '../../../../utils/resourceUtils';
import { shallowWithIntl } from '../../../../utils/testUtils';
import ReservationListItem from '../ReservationListItem';

describe('pages/user-reservations/reservation-list/ReservationListItem', () => {
  const props = {
    isAdmin: false,
    isStaff: false,
    reservation: Immutable(Reservation.build()),
    resource: Immutable(Resource.build({
      images: [Image.build()],
      type: { name: 'test_type' },
    })),
    unit: Immutable(Unit.build()),
  };

  let component;

  beforeAll(() => {
    component = shallowWithIntl(<ReservationListItem {...props} />);
  });

  describe('rendering', () => {
    test('renders a li element', () => {
      expect(component.is('li')).toBe(true);
    });

    test('displays an image with correct props', () => {
      const image = component.find('.resourceImg');

      expect(image).toHaveLength(1);
      expect(image.props().alt).toBe(props.resource.images[0].caption);
      expect(image.props().src).toBe(props.resource.images[0].url);
    });

    test('contains a link to resources page', () => {
      const expectedUrl = getResourcePageUrl(props.resource);
      const resourceLink = component.find({ to: expectedUrl });

      expect(resourceLink.length > 0).toBe(true);
    });

    test('displays the name of the resource', () => {
      const expected = props.resource.name;

      expect(component.find('h4').text()).toContain(expected);
    });

    test('displays the name of the given unit in props', () => {
      const expected = props.unit.name;

      expect(component.find('.unit-name').text()).toContain(expected);
    });

    test('contains TimeRange component with correct props', () => {
      const timeRange = component.find(TimeRange);
      expect(timeRange).toHaveLength(1);
      expect(timeRange.prop('begin')).toBe(props.reservation.begin);
      expect(timeRange.prop('end')).toBe(props.reservation.end);
    });

    test('renders ReservationStateLabel component', () => {
      const reservationStateLabel = component.find(ReservationStateLabel);
      expect(reservationStateLabel.length).toBe(1);
    });

    test('renders ReservationControls component', () => {
      const reservationControls = component.find(ReservationControls);
      expect(reservationControls).toHaveLength(1);
    });

    test('passes correct props to ReservationControls component', () => {
      const actualProps = component.find(ReservationControls).props();

      expect(actualProps.isAdmin).toBe(false);
      expect(actualProps.isStaff).toBe(false);
      expect(actualProps.reservation).toBe(props.reservation);
      expect(actualProps.resource).toBe(props.resource);
    });
  });
});
