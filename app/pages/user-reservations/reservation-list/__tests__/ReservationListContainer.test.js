import React from 'react';
import Immutable from 'seamless-immutable';
import snakeCaseKeys from 'snakecase-keys';

import Reservation from '../../../../utils/fixtures/Reservation';
import Resource from '../../../../utils/fixtures/Resource';
import Unit from '../../../../utils/fixtures/Unit';
import { shallowWithIntl } from '../../../../utils/testUtils';
import {
  UnconnectedReservationListContainer as ReservationListContainer,
} from '../ReservationListContainer';
import ReservationListItem from '../ReservationListItem';

// This project handles API responses differently based on the method
// that is used for fetching. Data in the redux store is in camelCase,
// but data fetched through the apiClient is in snake_case. This
// component was previously used in a context where API data
// originated from the redux store, but now lives in a context where
// this data comes directly from the apiClient.

// To be able to use the same test tooling, we are transforming the
// camelCase mock objects into snake_case mock objects.
const makeReservation = (...args) => snakeCaseKeys(Reservation.build(...args));
const makeResource = (...args) => snakeCaseKeys(Resource.build(...args));
const makeUnit = (...args) => snakeCaseKeys(Unit.build(...args));

describe('pages/user-reservations/reservation-list/ReservationListContainer', () => {
  function getWrapper(props) {
    const defaults = {
      isAdmin: false,
      loading: false,
      reservations: [],
      staffUnits: [],
      onPageChange: () => {},
      page: 0,
      pages: 0,
    };
    return shallowWithIntl(<ReservationListContainer {...defaults} {...props} />);
  }

  describe('with reservations', () => {
    const unit = makeUnit();
    const resource = makeResource({ unit });
    const props = {
      isAdmin: false,
      reservations: Immutable([
        makeReservation({ resource }),
        makeReservation({ resource: 'unfetched-resource' }),
      ]),
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
        expect(reservationListItems).toHaveLength(props.reservations.length);
      });

      test('passes isAdmin and reservation', () => {
        const reservationListItems = getWithReservationsWrapper().find(ReservationListItem);
        reservationListItems.forEach((reservationListItem) => {
          const actualProps = reservationListItem.props();
          expect(actualProps.isAdmin).toBe(props.isAdmin);
          expect(reservationListItems.at(0).prop('reservation')).toEqual(props.reservations[0]);
          expect(reservationListItems.at(1).prop('reservation')).toEqual(props.reservations[1]);
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
