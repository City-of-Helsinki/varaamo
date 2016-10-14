import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import Immutable from 'seamless-immutable';
import simple from 'simple-mock';

import Reservation from 'utils/fixtures/Reservation';
import Resource from 'utils/fixtures/Resource';
import ConfirmReservationModal from './ConfirmReservationModal';
import {
  UnconnectedReservationConfirmationContainer as ReservationConfirmationContainer,
} from './ReservationConfirmationContainer';

describe('pages/resource/reservation-calendar/ReservationConfirmationContainer', () => {
  const resource = Resource.build({ needManualConfirmation: false });
  const defaultProps = {
    actions: {
      closeConfirmReservationModal: simple.stub(),
      deleteReservation: simple.stub(),
      openConfirmReservationModal: simple.stub(),
      postReservation: simple.stub(),
      putReservation: simple.stub(),
    },
    confirmReservationModalIsOpen: false,
    isMakingReservations: false,
    params: { id: resource.id },
    reservationsToEdit: [],
    resource: Immutable(resource),
    selectedReservations: Immutable([
      Reservation.build(),
      Reservation.build(),
    ]),
    staffUnits: [],
  };

  function getWrapper(extraProps) {
    return shallow(<ReservationConfirmationContainer {...defaultProps} {...extraProps} />);
  }

  describe('render', () => {
    describe('ConfirmReservationModal', () => {
      it('is rendered', () => {
        const modal = getWrapper().find(ConfirmReservationModal);

        expect(modal.length).to.equal(1);
      });

      it('gets correct props', () => {
        const wrapper = getWrapper();
        const actualProps = wrapper.find(ConfirmReservationModal).props();

        expect(actualProps.isAdmin).to.exist;
        expect(actualProps.isEditing).to.exist;
        expect(actualProps.isMakingReservations).to.equal(defaultProps.isMakingReservations);
        expect(actualProps.isPreliminaryReservation)
          .to.equal(defaultProps.resource.needManualConfirmation);
        expect(actualProps.isStaff).to.exist;
        expect(actualProps.onClose).to.equal(defaultProps.actions.closeConfirmReservationModal);
        expect(actualProps.onConfirm).to.equal(wrapper.instance().handleReservation);
        expect(actualProps.reservationsToEdit).to.deep.equal(defaultProps.reservationsToEdit);
        expect(actualProps.selectedReservations).to.deep.equal(defaultProps.selectedReservations);
        expect(actualProps.show).to.equal(defaultProps.confirmReservationModalIsOpen);
      });
    });
  });

  describe('handleEdit', () => {
    describe('if no reservations are selected', () => {
      const extraProps = {
        selectedReservations: [],
        reservationsToEdit: [Reservation.build()],
      };
      const instance = getWrapper(extraProps).instance();
      instance.handleEdit();

      it('deletes the reservation that was edited', () => {
        const actualArgs = defaultProps.actions.deleteReservation.lastCall.args;

        expect(defaultProps.actions.deleteReservation.callCount).to.equal(1);
        expect(actualArgs[0]).to.equal(extraProps.reservationsToEdit[0]);
      });
    });

    describe('if reservations are selected', () => {
      const extraProps = {
        selectedReservations: [
          Reservation.build(),
          Reservation.build(),
          Reservation.build(),
        ],
        reservationsToEdit: [Reservation.build()],
      };
      const instance = getWrapper(extraProps).instance();
      instance.handleEdit();

      it('edits the first selected reservation', () => {
        const actualArgs = defaultProps.actions.putReservation.lastCall.args;
        const expectedReservation = Object.assign(
          {},
          extraProps.selectedReservations[0],
          { url: extraProps.reservationsToEdit[0].url }
        );

        expect(defaultProps.actions.putReservation.callCount).to.equal(1);
        expect(actualArgs[0]).to.deep.equal(expectedReservation);
      });

      it('adds new reservations for the rest of the selected reservations', (done) => {
        const expectedCallCount = extraProps.selectedReservations.length - 1;

        setTimeout(() => {
          expect(defaultProps.actions.postReservation.callCount).to.equal(expectedCallCount);
          defaultProps.actions.postReservation.calls.forEach((call, index) => {
            expect(call.args[0]).to.deep.equal(extraProps.selectedReservations[index + 1]);
          });
          done();
        }, 800);
      });
    });
  });

  describe('handleReservation', () => {
    const extraProps = {
      selectedReservations: [
        Reservation.build(),
        Reservation.build(),
      ],
    };
    const instance = getWrapper(extraProps).instance();

    before(() => {
      defaultProps.actions.postReservation.reset();
    });

    it('calls postReservation for each selected reservation', () => {
      instance.handleReservation();
      expect(defaultProps.actions.postReservation.callCount)
        .to.equal(extraProps.selectedReservations.length);
    });

    it('calls postReservation with correct arguments', () => {
      instance.handleReservation();
      const actualArgs = defaultProps.actions.postReservation.lastCall.args;
      const expected = extraProps.selectedReservations[1];

      expect(actualArgs[0]).to.deep.equal(expected);
    });

    it('adds given values to the reservation', () => {
      const values = { comments: 'Some random comment' };
      instance.handleReservation(values);
      const actualArgs = defaultProps.actions.postReservation.lastCall.args;

      expect(actualArgs[0].comments).to.equal(values.comments);
    });
  });
});
