import { expect } from 'chai';
import React from 'react';
import simple from 'simple-mock';
import { shallow } from 'enzyme';

import AdminReservationsFilters from 'components/reservation/AdminReservationsFilters';
import ReservationsList from 'containers/ReservationsList';
import {
  UnconnectedUserReservationsPage as UserReservationsPage,
} from 'containers/UserReservationsPage';

describe('Container: UserReservationsPage', () => {
  const changeAdminReservationsFilters = simple.stub();
  const fetchReservations = simple.stub();
  const fetchResources = simple.stub();
  const fetchUnits = simple.stub();

  const defaultProps = {
    actions: {
      changeAdminReservationsFilters,
      fetchReservations,
      fetchResources,
      fetchUnits,
    },
    adminReservationsFilters: { state: 'requested' },
    isAdmin: false,
    resourcesLoaded: true,
  };

  function getWrapper(extraProps = {}) {
    const props = Object.assign({}, defaultProps, extraProps);
    return shallow(<UserReservationsPage {...props} />);
  }

  describe('rendering', () => {
    describe('when user is not admin', () => {
      const wrapper = getWrapper({ isAdmin: false });

      it('should display "Omat varaukset" -title inside h1 tags', () => {
        const h1 = wrapper.find('h1');

        expect(h1.text()).to.equal('Omat varaukset');
      });

      it('should render ReservationsList with all user reservations', () => {
        const reservationsList = wrapper.find(ReservationsList);

        expect(reservationsList.length).to.equal(1);
        expect(reservationsList.props().filter).to.not.exist;
      });

      it('should not render AdminReservationsFilters', () => {
        const adminReservationsFilters = wrapper.find(AdminReservationsFilters);
        expect(adminReservationsFilters.length).to.equal(0);
      });
    });

    describe('when user is an admin', () => {
      const wrapper = getWrapper({ isAdmin: true });

      describe('headers', () => {
        const headers = wrapper.find('h1');

        it('should render two headers', () => {
          expect(headers.length).to.equal(2);
        });

        it('the first header should display "Alustavat varaukset"', () => {
          expect(headers.at(0).text()).to.equal('Alustavat varaukset');
        });

        it('the second header should display "Tavalliset varaukset"', () => {
          expect(headers.at(1).text()).to.equal('Tavalliset varaukset');
        });
      });

      describe('AdminReservationsFilters', () => {
        const adminReservationsFilters = wrapper.find(AdminReservationsFilters);

        it('should render AdminReservationsFilters', () => {
          expect(adminReservationsFilters.length).to.equal(1);
        });

        it('should pass correct props to AdminReservationsFilters', () => {
          const actualProps = adminReservationsFilters.props();
          expect(actualProps.filters).to.deep.equal(defaultProps.adminReservationsFilters);
          expect(typeof actualProps.onFiltersChange).to.equal('function');
        });
      });

      describe('reservation lists', () => {
        const lists = wrapper.find(ReservationsList);

        it('should render two reservation lists', () => {
          expect(lists.length).to.equal(2);
        });

        it('the first list should only contain filtered preliminary reservations', () => {
          expect(lists.at(0).props().filter).to.equal(defaultProps.adminReservationsFilters.state);
        });

        it('the second list should only contain regular reservations', () => {
          expect(lists.at(1).props().filter).to.equal('regular');
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

      it('should fetch resources', () => {
        expect(fetchResources.callCount).to.equal(1);
      });

      it('should fetch units', () => {
        expect(fetchUnits.callCount).to.equal(1);
      });

      it('should only fetch user\'s own reservations', () => {
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

      it('should fetch resources', () => {
        expect(fetchResources.callCount).to.equal(1);
      });

      it('should fetch units', () => {
        expect(fetchUnits.callCount).to.equal(1);
      });

      it('should fetch two batches of reservations', () => {
        expect(fetchReservations.callCount).to.equal(2);
      });

      it('should fetch reservations admin can approve', () => {
        expect(fetchReservations.calls[0].args[0].canApprove).to.equal(true);
      });

      it('should fetch admin\'s own reservations', () => {
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
      it('should not fetch reservations', () => {
        const nextProps = Object.assign({}, defaultProps, { isAdmin: false });
        instance.componentWillReceiveProps(nextProps);
        expect(fetchReservations.callCount).to.equal(0);
      });
    });

    describe('if user is an admin', () => {
      it('should fetch reservations', () => {
        const nextProps = Object.assign({}, defaultProps, { isAdmin: true });
        instance.componentWillReceiveProps(nextProps);
        expect(fetchReservations.callCount).to.equal(1);
      });

      it('should fetch reservations admin can approve', () => {
        const nextProps = Object.assign({}, defaultProps, { isAdmin: true });
        instance.componentWillReceiveProps(nextProps);
        expect(fetchReservations.lastCall.args[0].canApprove).to.equal(true);
      });

      it('should not fetch admin reservations twice', () => {
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
        changeAdminReservationsFilters.reset();
        fetchReservations.reset();
        instance.handleFiltersChange(filters);
      });

      it('should call changeAdminReservationsFilters with correct filters', () => {
        expect(changeAdminReservationsFilters.callCount).to.equal(1);
        expect(changeAdminReservationsFilters.lastCall.args[0]).to.deep.equal(filters);
      });

      it('should call fetchReservations without any filters', () => {
        expect(fetchReservations.callCount).to.equal(1);
        const expectedArgs = { canApprove: true };
        expect(fetchReservations.lastCall.args[0]).to.deep.equal(expectedArgs);
      });
    });

    describe('if filters.state is anything but "all"', () => {
      const filters = { state: 'requested' };

      before(() => {
        changeAdminReservationsFilters.reset();
        fetchReservations.reset();
        instance.handleFiltersChange(filters);
      });

      it('should call changeAdminReservationsFilters with correct filters', () => {
        expect(changeAdminReservationsFilters.callCount).to.equal(1);
        expect(changeAdminReservationsFilters.lastCall.args[0]).to.deep.equal(filters);
      });

      it('should call fetchReservations with correct state filter', () => {
        expect(fetchReservations.callCount).to.equal(1);
        const expectedArgs = Object.assign({}, { canApprove: true }, filters);
        expect(fetchReservations.lastCall.args[0]).to.deep.equal(expectedArgs);
      });
    });
  });
});
