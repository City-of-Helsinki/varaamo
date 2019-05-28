import React from 'react';
import simple from 'simple-mock';

import PageWrapper from '../PageWrapper';
import { shallowWithIntl } from '../../utils/testUtils';
import { UnconnectedUserReservationsPage as UserReservationsPage } from './UserReservationsPage';
import AdminReservationFilters from './reservation-filters/AdminReservationFilters';
import ReservationList from './reservation-list';

describe('pages/user-reservations/UserReservationsPage', () => {
  const changeAdminReservationFilters = simple.stub();
  const fetchReservations = simple.stub();
  const fetchResources = simple.stub();
  const fetchUnits = simple.stub();

  const defaultProps = {
    actions: {
      changeAdminReservationFilters,
      fetchReservations,
      fetchResources,
      fetchUnits,
    },
    adminReservationFilters: { state: 'requested' },
    isAdmin: false,
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

    describe('when user is not admin', () => {
      const wrapper = getWrapper({ isAdmin: false });

      test('displays correct title inside h1 tags', () => {
        const h1 = wrapper.find('h1');
        expect(h1.text()).toBe('UserReservationsPage.title');
      });

      test('renders ReservationList with all user reservations', () => {
        const reservationList = wrapper.find(ReservationList);

        expect(reservationList.length).toBe(1);
        expect(reservationList.props().filter).toBeFalsy();
      });

      test('does not render AdminReservationFilters', () => {
        const adminReservationFilters = wrapper.find(AdminReservationFilters);
        expect(adminReservationFilters.length).toBe(0);
      });
    });

    describe('when user is an admin', () => {
      const wrapper = getWrapper({ isAdmin: true });

      test('renders two headers', () => {
        expect(wrapper.find('h1').length).toBe(2);
      });

      test('renders correct text inside the first header', () => {
        const headerText = wrapper.find('h1').at(0).text();
        expect(headerText).toBe('UserReservationsPage.title');
      });

      test('renders correct text inside the second header', () => {
        const headerText = wrapper.find('h1').at(1).text();
        expect(headerText).toBe('UserReservationsPage.regularReservationsHeader');
      });

      describe('AdminReservationFilters', () => {
        const adminReservationFilters = wrapper.find(AdminReservationFilters);

        test('renders AdminReservationFilters', () => {
          expect(adminReservationFilters.length).toBe(1);
        });

        test('passes correct props to AdminReservationFilters', () => {
          const actualProps = adminReservationFilters.props();
          expect(actualProps.filters).toEqual(defaultProps.adminReservationFilters);
          expect(typeof actualProps.onFiltersChange).toBe('function');
        });
      });

      describe('reservation lists', () => {
        const lists = wrapper.find(ReservationList);

        test('renders two reservation lists', () => {
          expect(lists.length).toBe(2);
        });

        describe('the first list', () => {
          const list = lists.at(0);

          test('contains only filtered preliminary reservations', () => {
            expect(list.props().filter).toBe(defaultProps.adminReservationFilters.state);
          });

          test('is in correct loading state', () => {
            expect(list.props().loading).toBe(defaultProps.reservationsFetchCount < 2);
          });
        });

        describe('the second list', () => {
          const list = lists.at(1);

          test('the second list contains only regular reservations', () => {
            expect(list.props().filter).toBe('regular');
          });

          test('is in correct loading state', () => {
            expect(list.props().loading).toBe(defaultProps.reservationsFetchCount < 1);
          });
        });
      });
    });
  });

  describe('componentDidMount', () => {
    describe('if user is not an admin', () => {
      beforeAll(() => {
        fetchReservations.reset();
        fetchResources.reset();
        fetchUnits.reset();
        getWrapper({ isAdmin: false }).instance().componentDidMount();
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

    describe('if user is an admin', () => {
      beforeAll(() => {
        fetchReservations.reset();
        fetchResources.reset();
        fetchUnits.reset();
        getWrapper({ isAdmin: true }).instance().componentDidMount();
      });

      test('fetches resources', () => {
        expect(fetchResources.callCount).toBe(1);
      });

      test('fetches units', () => {
        expect(fetchUnits.callCount).toBe(1);
      });

      test('fetches two batches of reservations', () => {
        expect(fetchReservations.callCount).toBe(2);
      });

      test('fetches reservations admin can approve', () => {
        expect(fetchReservations.calls[0].args[0].canApprove).toBe(true);
      });

      test('fetches admin\'s own reservations', () => {
        expect(fetchReservations.calls[1].args[0].isOwn).toBe(true);
      });
    });
  });

  describe('componentWillReceiveProps', () => {
    let instance;

    beforeEach(() => {
      fetchReservations.reset();
      instance = getWrapper().instance();
    });

    describe('if user is not an admin', () => {
      test('does not fetch reservations', () => {
        const nextProps = Object.assign({}, defaultProps, { isAdmin: false });
        instance.componentWillReceiveProps(nextProps);
        expect(fetchReservations.callCount).toBe(0);
      });
    });

    describe('if user is an admin', () => {
      test('fetches reservations', () => {
        const nextProps = Object.assign({}, defaultProps, { isAdmin: true });
        instance.componentWillReceiveProps(nextProps);
        expect(fetchReservations.callCount).toBe(1);
      });

      test('fetches reservations admin can approve', () => {
        const nextProps = Object.assign({}, defaultProps, { isAdmin: true });
        instance.componentWillReceiveProps(nextProps);
        expect(fetchReservations.lastCall.args[0].canApprove).toBe(true);
      });

      test('does not fetch admin reservations twice', () => {
        const nextProps = Object.assign({}, defaultProps, { isAdmin: true });
        instance.componentWillReceiveProps(nextProps);
        instance.componentWillReceiveProps(nextProps);
        expect(fetchReservations.callCount).toBe(1);
      });
    });
  });

  describe('handleFiltersChange', () => {
    const instance = getWrapper().instance();

    describe('if filters.state is "all"', () => {
      const filters = { state: 'all' };

      beforeAll(() => {
        changeAdminReservationFilters.reset();
        fetchReservations.reset();
        instance.handleFiltersChange(filters);
      });

      test('calls changeAdminReservationFilters with correct filters', () => {
        expect(changeAdminReservationFilters.callCount).toBe(1);
        expect(changeAdminReservationFilters.lastCall.args[0]).toEqual(filters);
      });

      test('calls fetchReservations without any filters', () => {
        expect(fetchReservations.callCount).toBe(1);
        const expectedArgs = { canApprove: true };
        expect(fetchReservations.lastCall.args[0]).toEqual(expectedArgs);
      });
    });

    describe('if filters.state is anything but "all"', () => {
      const filters = { state: 'requested' };

      beforeAll(() => {
        changeAdminReservationFilters.reset();
        fetchReservations.reset();
        instance.handleFiltersChange(filters);
      });

      test('calls changeAdminReservationFilters with correct filters', () => {
        expect(changeAdminReservationFilters.callCount).toBe(1);
        expect(changeAdminReservationFilters.lastCall.args[0]).toEqual(filters);
      });

      test('calls fetchReservations with correct state filter', () => {
        expect(fetchReservations.callCount).toBe(1);
        const expectedArgs = Object.assign({}, { canApprove: true }, filters);
        expect(fetchReservations.lastCall.args[0]).toEqual(expectedArgs);
      });
    });
  });
});
