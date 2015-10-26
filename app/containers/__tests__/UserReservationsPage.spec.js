import { expect } from 'chai';
import React from 'react';
import sd from 'skin-deep';
import simple from 'simple-mock';

import Immutable from 'seamless-immutable';

import { UnconnectedUserReservationsPage as UserReservationsPage } from 'containers/UserReservationsPage';
import Reservation from 'fixtures/Reservation';
import Resource from 'fixtures/Resource';
import Unit from 'fixtures/Unit';

describe('Container: UserReservationsPage', () => {
  const unit = Unit.build();
  const resource = Resource.build();
  const reservation = Reservation.build();
  const props = {
    actions: {
      closeDeleteReservationModal: simple.stub(),
      fetchReservations: simple.stub(),
      fetchResources: simple.stub(),
      fetchUnits: simple.stub(),
      openDeleteReservationModal: simple.stub(),
    },
    deleteReservationModalIsOpen: false,
    isDeletingReservations: false,
    isFetchingReservations: false,
    reservations: Immutable([reservation]),
    resources: Immutable({ [resource.id]: resource }),
    units: Immutable({ [unit.id]: unit }),
  };
  const tree = sd.shallowRender(<UserReservationsPage {...props} />);

  it('should display "Omat varaukset" -title inside h1 tags', () => {
    const h1Tree = tree.subTree('h1');

    expect(h1Tree.props.children).to.equal('Omat varaukset');
  });

  describe('rendering ReservationsTable', () => {
    const reservationsTableTrees = tree.everySubTree('ReservationsTable');

    it('should render ReservationsTable component', () => {
      expect(reservationsTableTrees.length).to.equal(1);
    });

    it('should pass correct props to ReservationsTable component', () => {
      const actualProps = reservationsTableTrees[0].props;

      expect(actualProps.closeDeleteModal).to.equal(props.actions.closeDeleteReservationModal);
      expect(actualProps.deleteModalIsOpen).to.equal(props.deleteReservationModalIsOpen);
      expect(actualProps.isDeleting).to.equal(props.isDeletingReservations);
      expect(actualProps.isFetching).to.equal(props.isFetchingReservations);
      expect(actualProps.openDeleteModal).to.equal(props.actions.openDeleteReservationModal);
      expect(actualProps.reservations).to.deep.equal(props.reservations);
      expect(actualProps.resources).to.deep.equal(props.resources);
      expect(actualProps.units).to.deep.equal(props.units);
    });
  });

  describe('fetching data', () => {
    before(() => {
      const instance = tree.getMountedInstance();
      instance.componentDidMount();
    });

    it('should fetch reservations when component mounts', () => {
      expect(props.actions.fetchReservations.callCount).to.equal(1);
    });

    it('should fetch resources when component mounts', () => {
      expect(props.actions.fetchResources.callCount).to.equal(1);
    });

    it('should fetch units when component mounts', () => {
      expect(props.actions.fetchUnits.callCount).to.equal(1);
    });
  });
});
