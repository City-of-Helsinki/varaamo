import { expect } from 'chai';
import React from 'react';
import simple from 'simple-mock';
import sd from 'skin-deep';

import Immutable from 'seamless-immutable';

import {
  UnconnectedReservationsList as ReservationsList,
} from 'containers/ReservationsList';
import Reservation from 'fixtures/Reservation';
import Resource from 'fixtures/Resource';
import Unit from 'fixtures/Unit';

function getProps(props) {
  const defaults = {
    actions: {
      closeDeleteReservationModal: simple.stub(),
      deleteReservation: simple.stub(),
      fetchReservations: simple.stub(),
      fetchResources: simple.stub(),
      fetchUnits: simple.stub(),
      openDeleteReservationModal: simple.stub(),
      pushState: simple.stub(),
      selectReservationToDelete: simple.stub(),
      selectReservationToEdit: simple.stub(),
    },
    closeDeleteModal: simple.stub(),
    deleteReservationModalIsOpen: false,
    isDeletingReservations: false,
    isFetchingReservations: false,
    reservations: [],
    reservationsToDelete: [],
    resources: {},
    units: {},
  };

  return Object.assign({}, defaults, props);
}

describe('Component: reservation/ReservationsList', () => {
  describe('with reservations', () => {
    const unit = Unit.build();
    const resource = Resource.build({ unit: unit.id });
    const props = getProps({
      reservations: Immutable([
        Reservation.build({ resource: resource.id }),
        Reservation.build({ resource: 'unfetched-resource' }),
      ]),
      resources: Immutable({
        [resource.id]: resource,
      }),
      units: Immutable({
        [unit.id]: unit,
      }),
    });
    let tree;
    let instance;

    before(() => {
      tree = sd.shallowRender(<ReservationsList {...props} />);
      instance = tree.getMountedInstance();
    });

    it('should render a Table component', () => {
      const tableTrees = tree.everySubTree('Table');

      expect(tableTrees.length).to.equal(1);
    });

    describe('rendering table headers', () => {
      let thTrees;

      before(() => {
        thTrees = tree.everySubTree('th');
      });

      it('should render 3 th elements', () => {
        expect(thTrees.length).to.equal(3);
      });

      it('first th element should contain text "Tila"', () => {
        expect(thTrees[0].text()).to.equal('Tila');
      });

      it('second th element should contain text "Aika"', () => {
        expect(thTrees[1].text()).to.equal('Aika');
      });

      it('third th element should contain text "Toiminnot"', () => {
        expect(thTrees[2].text()).to.equal('Toiminnot');
      });
    });

    describe('rendering individual reservations', () => {
      let reservationsTableRowTrees;

      before(() => {
        reservationsTableRowTrees = tree.everySubTree('ReservationsListItem');
      });

      it('should render a ReservationsListItem for every reservation in props', () => {
        expect(reservationsTableRowTrees.length).to.equal(props.reservations.length);
      });

      it('should pass correct props to ReservationsListItem', () => {
        reservationsTableRowTrees.forEach((reservationTree, index) => {
          const actualProps = reservationTree.props;

          expect(actualProps.reservation).to.deep.equal(props.reservations[index]);
          expect(actualProps.openDeleteModal).to.deep.equal(props.actions.openDeleteReservationModal);
          expect(actualProps.pushState).to.deep.equal(props.actions.pushState);
          expect(
            actualProps.selectReservationToDelete
          ).to.deep.equal(
            props.actions.selectReservationToDelete
          );
          expect(
            actualProps.selectReservationToEdit
          ).to.deep.equal(
            props.actions.selectReservationToEdit
          );
        });
      });

      it('should pass resource corresponding to reservation.resource as a prop to ReservationsListItem', () => {
        expect(reservationsTableRowTrees[0].props.resource).to.deep.equal(resource);
      });

      it('should pass empty object as resource prop to ReservationsListItem if resource is unfetched', () => {
        expect(reservationsTableRowTrees[1].props.resource).to.deep.equal({});
      });

      it('should pass unit corresponding to resource.unit as a prop to ReservationsListItem', () => {
        expect(reservationsTableRowTrees[0].props.unit).to.deep.equal(unit);
      });

      it('should pass empty object as unit prop to ReservationsListItem if unit or resource is unfetched', () => {
        expect(reservationsTableRowTrees[1].props.unit).to.deep.equal({});
      });
    });

    describe('rendering DeleteModal', () => {
      let modalTrees;

      before(() => {
        modalTrees = tree.everySubTree('DeleteModal');
      });

      it('should render DeleteModal component', () => {
        expect(modalTrees.length).to.equal(1);
      });

      it('should pass correct props to DeleteModal component', () => {
        const actualProps = modalTrees[0].props;

        expect(actualProps.isDeleting).to.equal(props.isDeletingReservations);
        expect(actualProps.onClose).to.equal(props.actions.closeDeleteReservationModal);
        expect(actualProps.onConfirm).to.equal(instance.handleDelete);
        expect(actualProps.reservationsToDelete).to.deep.equal(props.reservationsToDelete);
        expect(actualProps.resources).to.deep.equal(props.resources);
        expect(actualProps.show).to.equal(props.deleteReservationModalIsOpen);
      });
    });
  });

  describe('without reservations', () => {
    const props = getProps({
      reservations: [],
    });
    let tree;

    before(() => {
      tree = sd.shallowRender(<ReservationsList {...props} />);
    });

    it('should render a message telling no reservations were found', () => {
      const expected = 'Sinulla ei vielä ole yhtään varausta.';

      expect(tree.textIn('p')).to.equal(expected);
    });
  });

  describe('fetching data', () => {
    const props = getProps({});
    let tree;

    before(() => {
      tree = sd.shallowRender(<ReservationsList {...props} />);
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

  describe('handleDelete', () => {
    const props = getProps({});
    let tree;

    before(() => {
      tree = sd.shallowRender(<ReservationsList {...props} />);
      const instance = tree.getMountedInstance();
      instance.handleDelete();
    });

    it('should call deleteReservation for each selected reservation', () => {
      expect(props.actions.deleteReservation.callCount).to.equal(props.reservationsToDelete.length);
    });

    it('should call deleteReservation with correct arguments', () => {
      const actualArgs = props.actions.deleteReservation.lastCall.args;
      const expected = props.reservationsToDelete[1];

      expect(actualArgs[0]).to.deep.equal(expected);
    });
  });
});
