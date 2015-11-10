import { expect } from 'chai';
import React from 'react';
import simple from 'simple-mock';
import sd from 'skin-deep';

import Immutable from 'seamless-immutable';

import ReservationsTableRow from 'components/reservation/ReservationsTableRow';
import Reservation from 'fixtures/Reservation';
import Resource from 'fixtures/Resource';
import Unit from 'fixtures/Unit';

describe('Component: reservation/ReservationsTableRow', () => {
  describe('rendering', () => {
    const props = {
      openDeleteModal: simple.stub(),
      pushState: simple.stub(),
      reservation: Immutable(Reservation.build()),
      resource: Immutable(Resource.build()),
      selectReservationToDelete: simple.stub(),
      selectReservationToEdit: simple.stub(),
      unit: Immutable(Unit.build()),
    };
    const tree = sd.shallowRender(<ReservationsTableRow {...props} />);

    it('should render a table row', () => {
      const vdom = tree.getRenderOutput();
      expect(vdom.type).to.equal('tr');
    });

    describe('table cells', () => {
      const tdTrees = tree.everySubTree('td');

      it('should render 3 table cells', () => {
        expect(tdTrees).to.have.length(3);
      });

      describe('the first table cell', () => {
        const tdTree = tdTrees[0];

        it('should contain a link to resources page', () => {
          const linkTree = tdTree.subTree('Link');

          expect(linkTree.props.to).to.contain('resources');
        });

        it('should display the name of the resource', () => {
          const expected = props.resource.name.fi;

          expect(tdTree.toString()).to.contain(expected);
        });

        it('should display the name of the given unit in props', () => {
          const expected = props.unit.name.fi;

          expect(tdTree.text()).to.contain(expected);
        });
      });

      describe('the second table cell', () => {
        const tdTree = tdTrees[1];

        it('should have a Link with correct props', () => {
          const linkTree = tdTree.subTree('Link');

          expect(linkTree).to.be.ok;
          expect(linkTree.props.to).to.equal(`/resources/${props.resource.id}/reservation`);
          expect(linkTree.props.query).to.deep.equal(
            {
              date: props.reservation.begin.split('T')[0],
              time: props.reservation.begin,
            }
          );
        });

        it('should contain a TimeRange component with correct begin and end times', () => {
          const timeRangeTree = tdTree.subTree('TimeRange');

          expect(timeRangeTree.props.begin).to.equal(props.reservation.begin);
          expect(timeRangeTree.props.end).to.equal(props.reservation.end);
        });
      });

      describe('the third table cell', () => {
        const tdTree = tdTrees[2];
        const buttonTrees = tdTree.everySubTree('Button');

        it('should contain two buttons', () => {
          expect(buttonTrees.length).to.equal(2);
        });

        describe('the first button', () => {
          const buttonTree = buttonTrees[0];

          it('should be an edit button', () => {
            expect(buttonTree.props.children).to.equal('Muokkaa');
          });

          describe('clicking the button', () => {
            buttonTree.props.onClick();

            it('should call props.selectReservationToEdit with reservation and minPeriod', () => {
              expect(props.selectReservationToEdit.callCount).to.equal(1);
              expect(
                props.selectReservationToEdit.lastCall.args[0]
              ).to.deep.equal(
                { reservation: props.reservation, minPeriod: props.resource.minPeriod }
              );
            });

            it('should call the props.pushState with correct url', () => {
              const actualUrlArg = props.pushState.lastCall.args[1];
              const expectedUrl = `/resources/${props.reservation.resource}/reservation`;

              expect(props.pushState.callCount).to.equal(1);
              expect(actualUrlArg).to.equal(expectedUrl);
            });
          });
        });

        describe('the second button', () => {
          const buttonTree = buttonTrees[1];

          it('should be a delete button', () => {
            expect(buttonTree.props.children).to.equal('Poista');
          });

          describe('clicking the button', () => {
            buttonTree.props.onClick();

            it('should call props.selectReservationToDelete with this reservation', () => {
              expect(props.selectReservationToDelete.callCount).to.equal(1);
              expect(
                props.selectReservationToDelete.lastCall.args[0]
              ).to.deep.equal(
                props.reservation
              );
            });

            it('should call the props.openDeleteModal function', () => {
              expect(props.openDeleteModal.callCount).to.equal(1);
            });
          });
        });
      });
    });
  });
});
