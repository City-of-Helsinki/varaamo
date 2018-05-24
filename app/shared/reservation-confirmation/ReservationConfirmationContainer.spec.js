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
      cancelReservationEdit: simple.stub(),
      closeConfirmReservationModal: simple.stub(),
      deleteReservation: simple.stub(),
      openConfirmReservationModal: simple.stub(),
      postReservation: simple.stub(),
      putReservation: simple.stub(),
      removeReservation: simple.stub(),
    },
    confirmReservationModalIsOpen: false,
    isMakingReservations: false,
    isStaff: false,
    params: { id: resource.id },
    recurringReservations: [Reservation.build()],
    reservationsToEdit: [],
    resource: Immutable(resource),
    selectedReservations: Immutable([
      Reservation.build(),
      Reservation.build(),
    ]),
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
        expect(actualProps.onCancel).to.equal(defaultProps.actions.cancelReservationEdit);
        expect(actualProps.onClose).to.equal(defaultProps.actions.closeConfirmReservationModal);
        expect(actualProps.onConfirm).to.equal(wrapper.instance().handleReservation);
        expect(actualProps.onRemoveReservation).to.equal(defaultProps.actions.removeReservation);
        expect(actualProps.recurringReservations).to.deep.equal(defaultProps.recurringReservations);
        expect(actualProps.reservationsToEdit).to.deep.equal(defaultProps.reservationsToEdit);
        expect(actualProps.selectedReservations).to.deep.equal(defaultProps.selectedReservations);
        expect(actualProps.show).to.equal(defaultProps.confirmReservationModalIsOpen);
      });
    });
  });

  describe('handleEdit', () => {
    it('edits the selected reservation', () => {
      const reservationsToEdit = [Reservation.build()];
      const instance = getWrapper({ reservationsToEdit }).instance();
      const newValues = { begin: 'foo', end: 'bar' };
      instance.handleEdit(newValues);
      const expectedArgs = [{ ...reservationsToEdit[0], ...newValues }];
      expect(defaultProps.actions.putReservation.callCount).to.equal(1);
      expect(defaultProps.actions.putReservation.lastCall.args).to.deep.equal(expectedArgs);
    });
  });

  describe('handleReservation', () => {
    const recurringReservations = [
      Reservation.build({
        begin: '2018-01-29T13:00:00+02:00',
        end: '2018-01-29T13:30:00+02:00',
        resource: resource.id,
      }),
    ];
    const selectedReservations = [
      Reservation.build({
        begin: '2018-01-30T13:00:00+02:00',
        end: '2018-01-30T13:30:00+02:00',
        resource: resource.id,
      }),
      Reservation.build({
        begin: '2018-01-30T15:00:00+02:00',
        end: '2018-01-30T15:30:00+02:00',
        resource: resource.id,
      }),
    ];
    const instance = getWrapper({ recurringReservations, selectedReservations }).instance();

    before(() => {
      defaultProps.actions.postReservation.reset();
    });

    it('calls postReservation for each selected and recurring reservation', () => {
      instance.handleReservation();
      expect(defaultProps.actions.postReservation.callCount)
        .to.equal(2);
    });

    it('calls postReservation with correct arguments', () => {
      instance.handleReservation();
      const actualArgs = defaultProps.actions.postReservation.lastCall.args;
      const expected = recurringReservations[0];

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
