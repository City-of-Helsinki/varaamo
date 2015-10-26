import { expect } from 'chai';
import React from 'react';
import sd from 'skin-deep';

import Immutable from 'seamless-immutable';

import ReservationsTable from 'components/reservation/ReservationsTable';
import Reservation from 'fixtures/Reservation';
import Resource from 'fixtures/Resource';
import Unit from 'fixtures/Unit';

describe('Component: reservation/ReservationsTable', () => {
  describe('with reservations', () => {
    const unit = Unit.build();
    const resource = Resource.build({ unit: unit.id });
    const props = {
      isFetching: false,
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
    };
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

      it('should render 3 th elements', () => {
        expect(thTrees.length).to.equal(3);
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
    });

    describe('rendering individual reservations', () => {
      let reservationsTableRowTrees;

      before(() => {
        reservationsTableRowTrees = tree.everySubTree('ReservationsTableRow');
      });

      it('should render a ReservationsTableRow for every reservation in props', () => {
        expect(reservationsTableRowTrees.length).to.equal(props.reservations.length);
      });

      it('should pass reservation as a prop to ReservationsTableRow', () => {
        reservationsTableRowTrees.forEach((reservationTree, index) => {
          const reservationVdom = reservationTree.getRenderOutput();

          expect(reservationVdom.props.reservation).to.deep.equal(props.reservations[index]);
        });
      });

      it('should pass resource corresponding to reservation.resource as a prop to ReservationsTableRow', () => {
        const reservationVdom = reservationsTableRowTrees[0].getRenderOutput();

        expect(reservationVdom.props.resource).to.deep.equal(resource);
      });

      it('should pass empty object as resource prop to ReservationsTableRow if resource is unfetched', () => {
        const reservationVdom = reservationsTableRowTrees[1].getRenderOutput();

        expect(reservationVdom.props.resource).to.deep.equal({});
      });

      it('should pass unit corresponding to resource.unit as a prop to ReservationsTableRow', () => {
        const reservationVdom = reservationsTableRowTrees[0].getRenderOutput();

        expect(reservationVdom.props.unit).to.deep.equal(unit);
      });

      it('should pass empty object as unit prop to ReservationsTableRow if unit or resource is unfetched', () => {
        const reservationVdom = reservationsTableRowTrees[1].getRenderOutput();

        expect(reservationVdom.props.unit).to.deep.equal({});
      });
    });
  });

  describe('without reservations', () => {
    const props = {
      isFetching: false,
      reservations: [],
      resources: {},
      units: {},
    };
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
