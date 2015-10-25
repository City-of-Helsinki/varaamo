import { expect } from 'chai';
import React from 'react';
import sd from 'skin-deep';

import Immutable from 'seamless-immutable';

import ReservationsTableRow from 'components/reservation/ReservationsTableRow';
import Reservation from 'fixtures/Reservation';
import Resource from 'fixtures/Resource';
import Unit from 'fixtures/Unit';

describe('Component: reservation/ReservationsTableRow', () => {
  describe('rendering', () => {
    const props = {
      reservation: Immutable(Reservation.build()),
      resource: Immutable(Resource.build()),
      unit: Immutable(Unit.build()),
    };
    let tree;
    let vdom;

    before(() => {
      tree = sd.shallowRender(<ReservationsTableRow {...props} />);
      vdom = tree.getRenderOutput();
    });

    it('should render a table row', () => {
      expect(vdom.type).to.equal('tr');
    });

    describe('table cells', () => {
      let tdTrees;

      before(() => {
        tdTrees = tree.everySubTree('td');
      });

      it('should render 3 table cells', () => {
        expect(tdTrees).to.have.length(3);
      });

      describe('the first table cell', () => {
        let tdTree;

        before(() => {
          tdTree = tdTrees[0];
        });

        it('should contain a link to resources page', () => {
          const linkTree = tdTree.subTree('Link');
          const linkVdom = linkTree.getRenderOutput();

          expect(linkVdom.props.to).to.contain('resources');
        });

        it('should display the name of the resource', () => {
          const expected = props.resource.name.fi;

          expect(tdTree.toString()).to.contain(expected);
        });
      });

      describe('the second table cell', () => {
        let tdTree;

        before(() => {
          tdTree = tdTrees[1];
        });

        it('should display the name of the given unit in props', () => {
          const expected = props.unit.name.fi;

          expect(tdTree.text()).to.equal(expected);
        });
      });

      describe('the third table cell', () => {
        let tdTree;

        before(() => {
          tdTree = tdTrees[2];
        });

        it('should contain a TimeRange component with correct begin and end times', () => {
          const timeRangeTree = tdTree.subTree('TimeRange');

          expect(timeRangeTree.props.begin).to.equal(props.reservation.begin);
          expect(timeRangeTree.props.end).to.equal(props.reservation.end);
        });
      });
    });
  });
});
