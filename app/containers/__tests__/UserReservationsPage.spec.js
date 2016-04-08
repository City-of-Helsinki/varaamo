import { expect } from 'chai';
import React from 'react';
import simple from 'simple-mock';
import { shallow } from 'enzyme';

import ReservationsList from 'containers/ReservationsList';
import {
  UnconnectedUserReservationsPage as UserReservationsPage,
} from 'containers/UserReservationsPage';

describe('Container: UserReservationsPage', () => {
  const defaultProps = {
    actions: {
      fetchReservations: simple.stub(),
      fetchResources: simple.stub(),
      fetchUnits: simple.stub(),
    },
    isAdmin: false,
    isFetchingResources: false,
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

      describe('reservation lists', () => {
        const lists = wrapper.find(ReservationsList);

        it('should render two reservation lists', () => {
          expect(lists.length).to.equal(2);
        });

        it('the first list should only contain preliminary reservations', () => {
          expect(lists.at(0).props().filter).to.equal('preliminary');
        });

        it('the second list should only contain regular reservations', () => {
          expect(lists.at(1).props().filter).to.equal('regular');
        });
      });
    });
  });

  describe('fetching data', () => {
    before(() => {
      getWrapper().instance().componentDidMount();
    });

    it('should fetch reservations when component mounts', () => {
      expect(defaultProps.actions.fetchReservations.callCount).to.equal(1);
    });

    it('should only fetch user\'s own reservations when component mounts', () => {
      expect(defaultProps.actions.fetchReservations.lastCall.args[0].isOwn).to.equal(true);
    });

    it('should fetch resources when component mounts', () => {
      expect(defaultProps.actions.fetchResources.callCount).to.equal(1);
    });

    it('should fetch units when component mounts', () => {
      expect(defaultProps.actions.fetchUnits.callCount).to.equal(1);
    });
  });
});
