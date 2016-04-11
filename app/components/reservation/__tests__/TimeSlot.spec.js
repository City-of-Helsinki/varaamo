import { expect } from 'chai';
import React from 'react';
import simple from 'simple-mock';
import sd from 'skin-deep';

import queryString from 'query-string';
import Immutable from 'seamless-immutable';

import TimeSlot from 'components/reservation/TimeSlot';
import TimeSlotFixture from 'fixtures/TimeSlot';
import Reservation from 'fixtures/Reservation';
import Resource from 'fixtures/Resource';

function getProps(props) {
  const defaults = {
    addNotification: simple.stub(),
    hasPreliminaryReservation: false,
    isEditing: true,
    isLoggedIn: true,
    onClick: simple.stub(),
    openReservationDeleteModal: simple.stub(),
    openReservationInfoModal: simple.stub(),
    updatePath: simple.stub(),
    resource: Resource.build(),
    selected: false,
    selectReservationToDelete: simple.stub(),
    selectReservationToEdit: simple.stub(),
    selectReservationToShow: simple.stub(),
    slot: Immutable(TimeSlotFixture.build()),
  };

  return Object.assign({}, defaults, props);
}

describe('Component: reservation/TimeSlot', () => {
  describe('render', () => {
    describe('when the slot is not reserved', () => {
      const props = getProps();
      const tree = sd.shallowRender(<TimeSlot {...props} />);
      const vdom = tree.getRenderOutput();

      it('should render a table row', () => {
        expect(vdom.type).to.equal('tr');
      });

      it('clicking the table row should call props.onClick with correct arguments', () => {
        tree.props.onClick();

        expect(props.onClick.callCount).to.equal(1);
      });

      describe('table cells', () => {
        const tdTrees = tree.everySubTree('td');

        it('should render 3 table cells', () => {
          expect(tdTrees).to.have.length(3);
        });

        describe('the first table cell', () => {
          const tdTree = tdTrees[0];
          const glyphiconTree = tdTree.subTree('Glyphicon');

          it('should render a checkbox icon', () => {
            expect(glyphiconTree).to.be.ok;
          });

          it('should not be checked if the slot is available', () => {
            expect(glyphiconTree.props.glyph).to.equal('unchecked');
          });
        });

        describe('the second table cell', () => {
          const tdTree = tdTrees[1];

          it('should display the slot time range as string', () => {
            expect(tdTree.text()).to.equal(props.slot.asString);
          });

          it('should have the specific time range inside a "time" element', () => {
            const timeTree = tdTree.subTree('time');
            const expected = `${props.slot.start}/${props.slot.end}`;

            expect(timeTree.props.dateTime).to.equal(expected);
          });
        });

        describe('the third table cell', () => {
          describe('when the slot is available', () => {
            const tdTree = tdTrees[2];
            const labelTrees = tdTree.everySubTree('Label');

            it('should render a label', () => {
              expect(labelTrees.length).to.equal(1);
            });

            it('should give proper props to the label', () => {
              expect(labelTrees[0].props.bsStyle).to.equal('success');
            });

            it('should display text "Vapaa"', () => {
              const expected = 'Vapaa';

              expect(labelTrees[0].props.children).to.equal(expected);
            });
          });
        });
      });
    });

    describe('when the slot is reserved', () => {
      const props = getProps({
        slot: Immutable(TimeSlotFixture.build({ reserved: true })),
      });
      const reservedTree = sd.shallowRender(<TimeSlot {...props} />);
      const tdTree = reservedTree.everySubTree('td')[2];
      const labelTrees = tdTree.everySubTree('Label');

      it('should render a label', () => {
        expect(labelTrees.length).to.equal(1);
      });

      it('should give proper props to the label', () => {
        expect(labelTrees[0].props.bsStyle).to.equal('danger');
      });

      it('should display text "Varattu"', () => {
        const expected = 'Varattu';

        expect(labelTrees[0].props.children).to.equal(expected);
      });
    });
  });

  describe('handleDeleteClick', () => {
    const props = getProps({
      slot: Immutable(TimeSlotFixture.build({
        reserved: true,
        reservation: Reservation.build(),
      })),
    });
    const tree = sd.shallowRender(<TimeSlot {...props} />);
    const instance = tree.getMountedInstance();
    instance.handleDeleteClick();

    it('should call props.selectReservationToDelete with slot.reservation', () => {
      expect(props.selectReservationToDelete.callCount).to.equal(1);
      expect(
        props.selectReservationToDelete.lastCall.args[0]
      ).to.deep.equal(
        props.slot.reservation
      );
    });

    it('should call the props.openReservationDeleteModal function', () => {
      expect(props.openReservationDeleteModal.callCount).to.equal(1);
    });
  });

  describe('handleEditClick', () => {
    const props = getProps({
      slot: Immutable(TimeSlotFixture.build({
        reserved: true,
        reservation: Reservation.build(),
      })),
    });
    const tree = sd.shallowRender(<TimeSlot {...props} />);
    const instance = tree.getMountedInstance();
    instance.handleEditClick();

    it('should call props.selectReservationToEdit with reservation and minPeriod', () => {
      expect(props.selectReservationToEdit.callCount).to.equal(1);
      expect(
        props.selectReservationToEdit.lastCall.args[0]
      ).to.deep.equal(
        { reservation: props.slot.reservation, minPeriod: props.resource.minPeriod }
      );
    });

    it('should call the props.updatePath with correct url', () => {
      const actualUrl = props.updatePath.lastCall.args[0];
      const reservation = props.slot.reservation;
      const query = queryString.stringify({
        date: reservation.begin.split('T')[0],
        time: reservation.begin,
      });
      const expectedUrl = `/resources/${props.slot.reservation.resource}/reservation?${query}`;

      expect(props.updatePath.callCount).to.equal(1);
      expect(actualUrl).to.equal(expectedUrl);
    });
  });

  describe('handleInfoClick', () => {
    const props = getProps({
      slot: Immutable(TimeSlotFixture.build({
        reserved: true,
        reservation: Reservation.build(),
      })),
    });
    const tree = sd.shallowRender(<TimeSlot {...props} />);
    const instance = tree.getMountedInstance();
    instance.handleInfoClick();

    it('should call props.selectReservationToShow with slot.reservation', () => {
      expect(props.selectReservationToShow.callCount).to.equal(1);
      expect(
        props.selectReservationToShow.lastCall.args[0]
      ).to.deep.equal(
        props.slot.reservation
      );
    });

    it('should call the props.openReservationInfoModal function', () => {
      expect(props.openReservationInfoModal.callCount).to.equal(1);
    });
  });
});
