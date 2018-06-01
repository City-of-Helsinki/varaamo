import { expect } from 'chai';
import React from 'react';
import simple from 'simple-mock';

import PageWrapper from 'pages/PageWrapper';
import { shallowWithIntl } from 'utils/testUtils';
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
    it('renders PageWrapper with correct title', () => {
      const pageWrapper = getWrapper().find(PageWrapper);
      expect(pageWrapper).to.have.length(1);
      expect(pageWrapper.prop('title')).to.equal('UserReservationsPage.title');
    });

    describe('when user is not admin', () => {
      const wrapper = getWrapper({ isAdmin: false });

      it('displays correct title inside h1 tags', () => {
        const h1 = wrapper.find('h1');
        expect(h1.text()).to.equal('UserReservationsPage.title');
      });

      it('renders ReservationList with all user reservations', () => {
        const reservationList = wrapper.find(ReservationList);

        expect(reservationList.length).to.equal(1);
        expect(reservationList.props().filter).to.not.exist;
      });

      it('does not render AdminReservationFilters', () => {
        const adminReservationFilters = wrapper.find(AdminReservationFilters);
        expect(adminReservationFilters.length).to.equal(0);
      });
    });

    describe('when user is an admin', () => {
      const wrapper = getWrapper({ isAdmin: true });

      it('renders two headers', () => {
        expect(wrapper.find('h1').length).to.equal(2);
      });

      it('renders correct text inside the first header', () => {
        const headerText = wrapper.find('h1').at(0).text();
        expect(headerText).to.equal('UserReservationsPage.title');
      });

      it('renders correct text inside the second header', () => {
        const headerText = wrapper.find('h1').at(1).text();
        expect(headerText).to.equal('UserReservationsPage.regularReservationsHeader');
      });

      describe('AdminReservationFilters', () => {
        const adminReservationFilters = wrapper.find(AdminReservationFilters);

        it('renders AdminReservationFilters', () => {
          expect(adminReservationFilters.length).to.equal(1);
        });

        it('passes correct props to AdminReservationFilters', () => {
          const actualProps = adminReservationFilters.props();
          expect(actualProps.filters).to.deep.equal(defaultProps.adminReservationFilters);
          expect(typeof actualProps.onFiltersChange).to.equal('function');
        });
      });

      describe('reservation lists', () => {
        const lists = wrapper.find(ReservationList);

        it('renders two reservation lists', () => {
          expect(lists.length).to.equal(2);
        });

        describe('the first list', () => {
          const list = lists.at(0);

          it('contains only filtered preliminary reservations', () => {
            expect(list.props().filter).to.equal(defaultProps.adminReservationFilters.state);
          });

          it('is in correct loading state', () => {
            expect(list.props().loading).to.equal(defaultProps.reservationsFetchCount < 2);
          });
        });

        describe('the second list', () => {
          const list = lists.at(1);

          it('the second list contains only regular reservations', () => {
            expect(list.props().filter).to.equal('regular');
          });

          it('is in correct loading state', () => {
            expect(list.props().loading).to.equal(defaultProps.reservationsFetchCount < 1);
          });
        });
      });
    });
  });

  describe('componentDidMount', () => {
    describe('if user is not an admin', () => {
      before(() => {
        fetchReservations.reset();
        fetchResources.reset();
        fetchUnits.reset();
        getWrapper({ isAdmin: false }).instance().componentDidMount();
      });

      it('fetches resources', () => {
        expect(fetchResources.callCount).to.equal(1);
      });

      it('fetches units', () => {
        expect(fetchUnits.callCount).to.equal(1);
      });

      it('fetches only user\'s own reservations', () => {
        expect(fetchReservations.callCount).to.equal(1);
        expect(fetchReservations.lastCall.args[0].isOwn).to.equal(true);
      });
    });

    describe('if user is an admin', () => {
      before(() => {
        fetchReservations.reset();
        fetchResources.reset();
        fetchUnits.reset();
        getWrapper({ isAdmin: true }).instance().componentDidMount();
      });

      it('fetches resources', () => {
        expect(fetchResources.callCount).to.equal(1);
      });

      it('fetches units', () => {
        expect(fetchUnits.callCount).to.equal(1);
      });

      it('fetches two batches of reservations', () => {
        expect(fetchReservations.callCount).to.equal(2);
      });

      it('fetches reservations admin can approve', () => {
        expect(fetchReservations.calls[0].args[0].canApprove).to.equal(true);
      });

      it('fetches admin\'s own reservations', () => {
        expect(fetchReservations.calls[1].args[0].isOwn).to.equal(true);
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
      it('does not fetch reservations', () => {
        const nextProps = Object.assign({}, defaultProps, { isAdmin: false });
        instance.componentWillReceiveProps(nextProps);
        expect(fetchReservations.callCount).to.equal(0);
      });
    });

    describe('if user is an admin', () => {
      it('fetches reservations', () => {
        const nextProps = Object.assign({}, defaultProps, { isAdmin: true });
        instance.componentWillReceiveProps(nextProps);
        expect(fetchReservations.callCount).to.equal(1);
      });

      it('fetches reservations admin can approve', () => {
        const nextProps = Object.assign({}, defaultProps, { isAdmin: true });
        instance.componentWillReceiveProps(nextProps);
        expect(fetchReservations.lastCall.args[0].canApprove).to.equal(true);
      });

      it('does not fetch admin reservations twice', () => {
        const nextProps = Object.assign({}, defaultProps, { isAdmin: true });
        instance.componentWillReceiveProps(nextProps);
        instance.componentWillReceiveProps(nextProps);
        expect(fetchReservations.callCount).to.equal(1);
      });
    });
  });

  describe('handleFiltersChange', () => {
    const instance = getWrapper().instance();

    describe('if filters.state is "all"', () => {
      const filters = { state: 'all' };

      before(() => {
        changeAdminReservationFilters.reset();
        fetchReservations.reset();
        instance.handleFiltersChange(filters);
      });

      it('calls changeAdminReservationFilters with correct filters', () => {
        expect(changeAdminReservationFilters.callCount).to.equal(1);
        expect(changeAdminReservationFilters.lastCall.args[0]).to.deep.equal(filters);
      });

      it('calls fetchReservations without any filters', () => {
        expect(fetchReservations.callCount).to.equal(1);
        const expectedArgs = { canApprove: true };
        expect(fetchReservations.lastCall.args[0]).to.deep.equal(expectedArgs);
      });
    });

    describe('if filters.state is anything but "all"', () => {
      const filters = { state: 'requested' };

      before(() => {
        changeAdminReservationFilters.reset();
        fetchReservations.reset();
        instance.handleFiltersChange(filters);
      });

      it('calls changeAdminReservationFilters with correct filters', () => {
        expect(changeAdminReservationFilters.callCount).to.equal(1);
        expect(changeAdminReservationFilters.lastCall.args[0]).to.deep.equal(filters);
      });

      it('calls fetchReservations with correct state filter', () => {
        expect(fetchReservations.callCount).to.equal(1);
        const expectedArgs = Object.assign({}, { canApprove: true }, filters);
        expect(fetchReservations.lastCall.args[0]).to.deep.equal(expectedArgs);
      });
    });
  });
});
