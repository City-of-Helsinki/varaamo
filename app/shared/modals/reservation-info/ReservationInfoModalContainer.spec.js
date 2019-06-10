import simple from 'simple-mock';

import FormTypes from '../../../constants/FormTypes';
import { mergeProps } from './ReservationInfoModalContainer';

describe('shared/modals/reservation-info/ReservationInfoModalContainer', () => {
  describe('mergeProps', () => {
    const reservation = { id: 'res-99' };
    const resource = { id: 'resource-123' };
    const stateProps = { reservation, resource };
    const actions = {
      cancelReservationEditInInfoModal: () => null,
      commentReservation: () => null,
      confirmPreliminaryReservation: () => null,
      hideReservationInfoModal: () => null,
      openReservationCancelModal: () => null,
      resetForm: () => null,
      selectReservationToCancel: () => null,
    };

    function getProps(extraActions) {
      return mergeProps(stateProps, { ...actions, ...extraActions });
    }

    describe('onCancelClick', () => {
      function callOnCancelClick(extraActions) {
        getProps({ ...actions, ...extraActions }).onCancelClick();
      }

      test('calls selectReservationToCancel with props.reservation', () => {
        const selectReservationToCancel = simple.mock();
        callOnCancelClick({ selectReservationToCancel });
        expect(selectReservationToCancel.callCount).toBe(1);
        expect(selectReservationToCancel.lastCall.args).toEqual([reservation]);
      });

      test('calls the props.actions.openReservationCancelModal', () => {
        const openReservationCancelModal = simple.mock();
        callOnCancelClick({ openReservationCancelModal });
        expect(openReservationCancelModal.callCount).toBe(1);
      });
    });

    describe('onCancelEditClick', () => {
      function callOnCancelEditClick(extraActions) {
        getProps({ ...actions, ...extraActions }).onCancelEditClick();
      }

      test('calls cancelReservationEditInInfoModal', () => {
        const cancelReservationEditInInfoModal = simple.mock();
        callOnCancelEditClick({ cancelReservationEditInInfoModal });
        expect(cancelReservationEditInInfoModal.callCount).toBe(1);
      });

      test('calls resetForm for reservation edit form', () => {
        const resetForm = simple.mock();
        callOnCancelEditClick({ resetForm });
        expect(resetForm.callCount).toBe(1);
        expect(resetForm.lastCall.args).toEqual([FormTypes.RESERVATION_EDIT]);
      });
    });

    describe('onConfirmClick', () => {
      function callOnConfirmClick(extraActions) {
        getProps({ ...actions, ...extraActions }).onConfirmClick();
      }

      test('calls confirmPreliminaryReservation with props.reservation', () => {
        const confirmPreliminaryReservation = simple.mock();
        callOnConfirmClick({ confirmPreliminaryReservation });
        expect(confirmPreliminaryReservation.callCount).toBe(1);
        expect(confirmPreliminaryReservation.lastCall.args).toEqual([reservation]);
      });
    });

    describe('onDenyClick', () => {
      function callOnDenyClick(extraActions) {
        getProps({ ...actions, ...extraActions }).onDenyClick();
      }

      test('calls denyPreliminaryReservation with props.reservation', () => {
        const denyPreliminaryReservation = simple.mock();
        callOnDenyClick({ denyPreliminaryReservation });
        expect(denyPreliminaryReservation.callCount).toBe(1);
        expect(denyPreliminaryReservation.lastCall.args).toEqual([reservation]);
      });
    });

    describe('onSaveCommentsClick', () => {
      const comments = 'Some comments';

      function callOnSaveCommentsClick(extraActions) {
        getProps({ ...actions, ...extraActions }).onSaveCommentsClick(comments);
      }

      test(
        'calls commentReservation with reservation, resource and the given comment',
        () => {
          const commentReservation = simple.mock();
          callOnSaveCommentsClick({ commentReservation });
          expect(commentReservation.callCount).toBe(1);
          expect(commentReservation.lastCall.args).toEqual([reservation, resource, comments]);
        }
      );
    });
  });
});
