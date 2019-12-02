import React from 'react';
import Immutable from 'seamless-immutable';
import simple from 'simple-mock';

import Reservation from '../../../../utils/fixtures/Reservation';
import Resource from '../../../../utils/fixtures/Resource';
import Unit from '../../../../utils/fixtures/Unit';
import { shallowWithIntl } from '../../../../utils/testUtils';
import {
  UnconnectedReservationListContainer as ReservationListContainer,
} from '../ReservationListContainer';
import ReservationListItem from '../ReservationListItem';

describe('pages/user-reservations/reservation-list/ReservationListContainer', () => {
  const fetchReservations = simple.stub();
  function getWrapper(props) {
    const defaults = {
      fetchReservations,
      isAdmin: false,
      loading: false,
      location: {
        search: ''
      },
      reservations: [],
      resources: {},
      staffUnits: [],
      paginatedReservations: {},
      pageSize: 0,
      units: {},
    };
    return shallowWithIntl(<ReservationListContainer {...defaults} {...props} />);
  }

  describe('with reservations', () => {
    const unit = Unit.build();
    const resource = Resource.build({ unit: unit.id });
    const props = {
      isAdmin: false,
      location: {
        search: '',
      },
      reservations: Immutable([
        Reservation.build({ resource: resource.id }),
        Reservation.build({ resource: 'unfetched-resource' }),
      ]),
      paginatedReservations: {
        count: 0,
        comingReservations: Immutable([
          Reservation.build({ resource: resource.id }),
          Reservation.build({ resource: 'unfetched-resource' }),
        ]),
        pastReservations: Immutable([
          Reservation.build({ resource: resource.id }),
          Reservation.build({ resource: 'unfetched-resource' }),
        ]),
      },
      pageSize: 10,
      resources: Immutable({
        [resource.id]: resource,
      }),
      units: Immutable({
        [unit.id]: unit,
      }),
    };

    function getWithReservationsWrapper() {
      return getWrapper(props);
    }

    test('renders a ul element', () => {
      const ul = getWithReservationsWrapper().find('ul');
      expect(ul).toHaveLength(1);
    });

    describe('rendering individual reservations', () => {
      test('renders a ReservationListItem for every reservation in props', () => {
        const reservationListItems = getWithReservationsWrapper().find(ReservationListItem);
        const { comingReservations, pastReservations } = props.paginatedReservations;
        expect(reservationListItems).toHaveLength(comingReservations.length + pastReservations.length);
      });

      test('passes isAdmin, isStaff and reservation', () => {
        const reservationListItems = getWithReservationsWrapper().find(ReservationListItem);
        reservationListItems.forEach((reservationListItem) => {
          const actualProps = reservationListItem.props();
          expect(actualProps.isAdmin).toBe(props.isAdmin);
          expect(actualProps.isStaff).toBe(false);
          expect(reservationListItems.at(0).prop('resource')).toEqual(resource);
          expect(reservationListItems.at(1).prop('resource')).toEqual({});
          expect(reservationListItems.at(0).prop('unit')).toEqual(unit);
          expect(reservationListItems.at(1).prop('unit')).toEqual({});
        });
      });
    });
  });

  describe('without reservations', () => {
    const reservations = [];
    function getWithouReservationsWrapper(emptyMessage) {
      return getWrapper({ emptyMessage, reservations });
    }

    describe('when emptyMessage is given in props', () => {
      const emptyMessage = 'No reservations found';

      test('displays the emptyMessage', () => {
        const message = getWithouReservationsWrapper(emptyMessage).find('p').text();
        expect(message).toBe(emptyMessage);
      });
    });

    describe('when emptyMessage is not given in props', () => {
      test('renders a message telling no reservations were found', () => {
        const message = getWithouReservationsWrapper().find('p').text();
        expect(message).toBe('ReservationListContainer.emptyMessage');
      });
    });
  });
});
