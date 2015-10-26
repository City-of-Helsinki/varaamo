import { expect } from 'chai';
import React from 'react';
import simple from 'simple-mock';
import sd from 'skin-deep';

import Immutable from 'seamless-immutable';

import ReservationsTable from 'components/reservation/ReservationsTable';
import Reservation from 'fixtures/Reservation';
import Resource from 'fixtures/Resource';
import Unit from 'fixtures/Unit';

function getProps(props) {
  const defaults = {
    closeDeleteModal: simple.stub(),
    deleteModalIsOpen: false,
    isDeleting: false,
    isFetching: false,
    openDeleteModal: simple.stub(),
    reservations: [],
    reservationsToDelete: [],
    resources: {},
    units: {},
  };

  return Object.assign({}, defaults, props);
}

describe('Component: reservation/ReservationsTable', () => {
  describe('with reservations', () => {
    const unit = Unit.build();
    const resource = Resource.build({ unit: unit.id });
    const props = getProps({
      reservations: Immutable([
        Reservation.build({ resource: resource.id }),
        Reservation.build({ resource: 'unfetched-resource' }),
      ]),
      reservationsToDelete: [Reservation.build()],
      resources: Immutable({
        [resource.id]: resource,
      }),
      units: Immutable({
        [unit.id]: unit,
      }),
    });
    let tree;

    before(() => {
      tree = sd.shallowRender(<ReservationsTable {...props} />);
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

      it('should render 4 th elements', () => {
        expect(thTrees.length).to.equal(4);
      });

      it('first th element should contain text "Tila"', () => {
        expect(thTrees[0].text()).to.equal('Tila');
      });

      it('second th element should contain text "Sijainti"', () => {
        expect(thTrees[1].text()).to.equal('Sijainti');
      });

      it('third th element should contain text "Aika"', () => {
        expect(thTrees[2].text()).to.equal('Aika');
      });

      it('fourth th element should contain text "Toiminnot"', () => {
        expect(thTrees[3].text()).to.equal('Toiminnot');
      });
    });

    describe('rendering individual reservations', () => {
      let reservationsTableRowTrees;

      before(() => {
        reservationsTableRowTrees = tree.everySubTree('ReservationsTableRow');
      });

      it('should render a ReservationsTableRow for every reservation in props', () => {
        expect(reservationsTableRowTrees.length).to.equal(props.reservations.length);
      });

      it('should pass correct props to ReservationsTableRow', () => {
        reservationsTableRowTrees.forEach((reservationTree, index) => {
          const actualProps = reservationTree.props;

          expect(actualProps.reservation).to.deep.equal(props.reservations[index]);
          expect(actualProps.openDeleteModal).to.deep.equal(props.openDeleteModal);
        });
      });

      it('should pass resource corresponding to reservation.resource as a prop to ReservationsTableRow', () => {
        expect(reservationsTableRowTrees[0].props.resource).to.deep.equal(resource);
      });

      it('should pass empty object as resource prop to ReservationsTableRow if resource is unfetched', () => {
        expect(reservationsTableRowTrees[1].props.resource).to.deep.equal({});
      });

      it('should pass unit corresponding to resource.unit as a prop to ReservationsTableRow', () => {
        expect(reservationsTableRowTrees[0].props.unit).to.deep.equal(unit);
      });

      it('should pass empty object as unit prop to ReservationsTableRow if unit or resource is unfetched', () => {
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

        expect(actualProps.isDeleting).to.equal(props.isDeleting);
        expect(actualProps.onClose).to.equal(props.closeDeleteModal);
        expect(actualProps.onConfirm).to.equal(props.closeDeleteModal);
        expect(actualProps.reservationsToDelete).to.deep.equal(props.reservationsToDelete);
        expect(actualProps.show).to.equal(props.deleteModalIsOpen);
      });
    });
  });

  describe('without reservations', () => {
    const props = getProps({
      reservations: [],
    });
    let tree;

    before(() => {
      tree = sd.shallowRender(<ReservationsTable {...props} />);
    });

    it('should render a message telling no reservations were found', () => {
      const expected = 'Sinulla ei vielä ole yhtään varauksia.';

      expect(tree.textIn('p')).to.equal(expected);
    });
  });
});
