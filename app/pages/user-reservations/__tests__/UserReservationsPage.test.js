import React from 'react';
import simple from 'simple-mock';

import PageWrapper from '../../PageWrapper';
import { shallowWithIntl } from '../../../utils/testUtils';
import { UnconnectedUserReservationsPage as UserReservationsPage } from '../UserReservationsPage';
import ReservationList from '../reservation-list/ReservationListContainer';

describe('pages/user-reservations/UserReservationsPage', () => {
  const fetchReservations = simple.stub();
  const fetchResources = simple.stub();
  const fetchUnits = simple.stub();

  const defaultProps = {
    actions: {
      fetchReservations,
      fetchResources,
      fetchUnits,
    },
    location: {
      search: '',
    },
    reservationsFetchCount: 1,
    resourcesLoaded: true,
  };

  function getWrapper(extraProps = {}) {
    const props = Object.assign({}, defaultProps, extraProps);
    return shallowWithIntl(<UserReservationsPage {...props} />);
  }

  describe('render', () => {
    test('renders PageWrapper with correct title', () => {
      const pageWrapper = getWrapper().find(PageWrapper);
      expect(pageWrapper).toHaveLength(1);
      expect(pageWrapper.prop('title')).toBe('UserReservationsPage.title');
    });

    describe('normal render', () => {
      const wrapper = getWrapper();

      test('displays correct title inside h1 tags', () => {
        const h1 = wrapper.find('h1');
        expect(h1.text()).toBe('UserReservationsPage.title');
      });

      test('renders ReservationList with all user reservations', () => {
        const reservationList = wrapper.find(ReservationList);

        expect(reservationList.length).toBe(1);
        expect(reservationList.props().filter).toBeFalsy();
      });
    });
  });

  describe('componentDidMount', () => {
    beforeAll(() => {
      fetchReservations.reset();
      fetchResources.reset();
      fetchUnits.reset();
      getWrapper().instance().componentDidMount();
    });

    test('fetches resources', () => {
      expect(fetchResources.callCount).toBe(1);
    });

    test('fetches units', () => {
      expect(fetchUnits.callCount).toBe(1);
    });

    test('fetches only user\'s own reservations', () => {
      expect(fetchReservations.callCount).toBe(1);
      expect(fetchReservations.lastCall.args[0].isOwn).toBe(true);
    });
  });
});
