import { expect } from 'chai';
import React from 'react';
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
    isAdmin: false,
    loading: false,
    reservations: [],
    resources: {},
    staffUnits: [],
    units: {},
  };

  return Object.assign({}, defaults, props);
}

describe('Container: ReservationsList', () => {
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

    before(() => {
      tree = sd.shallowRender(<ReservationsList {...props} />);
    });

    it('should render a ul element', () => {
      const ulTree = tree.subTree('ul');

      expect(ulTree).to.be.ok;
    });

    describe('rendering individual reservations', () => {
      let reservationsListItemTrees;

      before(() => {
        reservationsListItemTrees = tree.everySubTree('ReservationsListItem');
      });

      it('should render a ReservationsListItem for every reservation in props', () => {
        expect(reservationsListItemTrees.length).to.equal(props.reservations.length);
      });

      it('should pass correct props to ReservationsListItem', () => {
        reservationsListItemTrees.forEach((reservationTree, index) => {
          const actualProps = reservationTree.props;

          expect(actualProps.isAdmin).to.equal(props.isAdmin);
          expect(actualProps.isStaff).to.equal(false);
          expect(actualProps.reservation).to.deep.equal(props.reservations[index]);
        });
      });

      it('should pass resource corresponding to reservation.resource as a prop to ReservationsListItem', () => {
        expect(reservationsListItemTrees[0].props.resource).to.deep.equal(resource);
      });

      it('should pass empty object as resource prop to ReservationsListItem if resource is unfetched', () => {
        expect(reservationsListItemTrees[1].props.resource).to.deep.equal({});
      });

      it('should pass unit corresponding to resource.unit as a prop to ReservationsListItem', () => {
        expect(reservationsListItemTrees[0].props.unit).to.deep.equal(unit);
      });

      it('should pass empty object as unit prop to ReservationsListItem if unit or resource is unfetched', () => {
        expect(reservationsListItemTrees[1].props.unit).to.deep.equal({});
      });
    });
  });

  describe('without reservations', () => {
    describe('when emptyMessage is given in props', () => {
      const props = getProps({
        emptyMessage: 'No reservations found',
        reservations: [],
      });
      const tree = sd.shallowRender(<ReservationsList {...props} />);

      it('should display the emptyMessage', () => {
        expect(tree.textIn('p')).to.equal(props.emptyMessage);
      });
    });

    describe('when emptyMessage is not given in props', () => {
      const props = getProps({
        reservations: [],
      });
      const tree = sd.shallowRender(<ReservationsList {...props} />);

      it('should render a message telling no reservations were found', () => {
        const expected = 'Sinulla ei vielä ole yhtään varausta.';

        expect(tree.textIn('p')).to.equal(expected);
      });
    });
  });
});
