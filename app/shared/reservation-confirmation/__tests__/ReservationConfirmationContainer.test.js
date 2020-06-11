import { shallow } from 'enzyme';
import React from 'react';
import Immutable from 'seamless-immutable';
import simple from 'simple-mock';

import Reservation from '../../../utils/fixtures/Reservation';
import Resource from '../../../utils/fixtures/Resource';
import ConfirmReservationModal from '../ConfirmReservationModal';
// eslint-disable-next-line max-len
import { UnconnectedReservationConfirmationContainer as ReservationConfirmationContainer } from '../ReservationConfirmationContainer';

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
    selectedReservations: Immutable([Reservation.build(), Reservation.build()]),
  };

  function getWrapper(extraProps) {
    return shallow(
      <ReservationConfirmationContainer {...defaultProps} {...extraProps} />
    );
  }

  describe('render', () => {
    describe('ConfirmReservationModal', () => {
      test('is rendered', () => {
        const modal = getWrapper().find(ConfirmReservationModal);

        expect(modal.length).toBe(1);
      });

      test('gets correct props', () => {
        const wrapper = getWrapper();
        const actualProps = wrapper.find(ConfirmReservationModal).props();

        expect(actualProps.isAdmin).toBeDefined();
        expect(actualProps.isEditing).toBeDefined();
        expect(actualProps.isMakingReservations).toBe(
          defaultProps.isMakingReservations
        );
        expect(actualProps.isPreliminaryReservation).toBe(
          defaultProps.resource.needManualConfirmation
        );
        expect(actualProps.isStaff).toBeDefined();
        expect(actualProps.onCancel).toBe(
          defaultProps.actions.cancelReservationEdit
        );
        expect(actualProps.onClose).toBe(
          defaultProps.actions.closeConfirmReservationModal
        );
        expect(actualProps.onConfirm).toBe(
          wrapper.instance().handleReservation
        );
        expect(actualProps.onRemoveReservation).toBe(
          defaultProps.actions.removeReservation
        );
        expect(actualProps.recurringReservations).toEqual(
          defaultProps.recurringReservations
        );
        expect(actualProps.reservationsToEdit).toEqual(
          defaultProps.reservationsToEdit
        );
        expect(actualProps.selectedReservations).toEqual(
          defaultProps.selectedReservations
        );
        expect(actualProps.show).toBe(
          defaultProps.confirmReservationModalIsOpen
        );
      });
    });
  });

  describe('handleEdit', () => {
    test('edits the selected reservation', () => {
      const reservationsToEdit = [Reservation.build()];
      const instance = getWrapper({ reservationsToEdit }).instance();
      const newValues = { begin: 'foo', end: 'bar' };
      instance.handleEdit(newValues);
      const expectedArgs = [{ ...reservationsToEdit[0], ...newValues }];
      expect(defaultProps.actions.putReservation.callCount).toBe(1);
      expect(defaultProps.actions.putReservation.lastCall.args).toEqual(
        expectedArgs
      );
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
    const instance = getWrapper({
      recurringReservations,
      selectedReservations,
    }).instance();

    beforeAll(() => {
      defaultProps.actions.postReservation.reset();
    });

    test('calls postReservation for each selected and recurring reservation', () => {
      instance.handleReservation();
      expect(defaultProps.actions.postReservation.callCount).toBe(2);
    });

    test('calls postReservation with correct arguments', () => {
      instance.handleReservation();
      const actualArgs = defaultProps.actions.postReservation.lastCall.args;
      const expected = recurringReservations[0];

      expect(actualArgs[0]).toEqual(expected);
    });

    test('adds given values to the reservation', () => {
      const values = { comments: 'Some random comment' };
      instance.handleReservation(values);
      const actualArgs = defaultProps.actions.postReservation.lastCall.args;

      expect(actualArgs[0].comments).toBe(values.comments);
    });
  });
});
