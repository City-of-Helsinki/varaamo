import FormTypes from 'constants/FormTypes';

import { expect } from 'chai';
import simple from 'simple-mock';

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

      it('calls selectReservationToCancel with props.reservation', () => {
        const selectReservationToCancel = simple.mock();
        callOnCancelClick({ selectReservationToCancel });
        expect(selectReservationToCancel.callCount).to.equal(1);
        expect(selectReservationToCancel.lastCall.args).to.deep.equal([reservation]);
      });

      it('calls the props.actions.openReservationCancelModal', () => {
        const openReservationCancelModal = simple.mock();
        callOnCancelClick({ openReservationCancelModal });
        expect(openReservationCancelModal.callCount).to.equal(1);
      });
    });

    describe('onCancelEditClick', () => {
      function callOnCancelEditClick(extraActions) {
        getProps({ ...actions, ...extraActions }).onCancelEditClick();
      }

      it('calls cancelReservationEditInInfoModal', () => {
        const cancelReservationEditInInfoModal = simple.mock();
        callOnCancelEditClick({ cancelReservationEditInInfoModal });
        expect(cancelReservationEditInInfoModal.callCount).to.equal(1);
      });

      it('calls resetForm for reservation edit form', () => {
        const resetForm = simple.mock();
        callOnCancelEditClick({ resetForm });
        expect(resetForm.callCount).to.equal(1);
        expect(resetForm.lastCall.args).to.deep.equal([FormTypes.RESERVATION_EDIT]);
      });
    });

    describe('onConfirmClick', () => {
      function callOnConfirmClick(extraActions) {
        getProps({ ...actions, ...extraActions }).onConfirmClick();
      }

      it('calls confirmPreliminaryReservation with props.reservation', () => {
        const confirmPreliminaryReservation = simple.mock();
        callOnConfirmClick({ confirmPreliminaryReservation });
        expect(confirmPreliminaryReservation.callCount).to.equal(1);
        expect(confirmPreliminaryReservation.lastCall.args).to.deep.equal([reservation]);
      });
    });

    describe('onDenyClick', () => {
      function callOnDenyClick(extraActions) {
        getProps({ ...actions, ...extraActions }).onDenyClick();
      }

      it('calls denyPreliminaryReservation with props.reservation', () => {
        const denyPreliminaryReservation = simple.mock();
        callOnDenyClick({ denyPreliminaryReservation });
        expect(denyPreliminaryReservation.callCount).to.equal(1);
        expect(denyPreliminaryReservation.lastCall.args).to.deep.equal([reservation]);
      });
    });

    describe('onSaveCommentsClick', () => {
      const comments = 'Some comments';

      function callOnSaveCommentsClick(extraActions) {
        getProps({ ...actions, ...extraActions }).onSaveCommentsClick(comments);
      }

      it('calls commentReservation with reservation, resource and the given comment', () => {
        const commentReservation = simple.mock();
        callOnSaveCommentsClick({ commentReservation });
        expect(commentReservation.callCount).to.equal(1);
        expect(commentReservation.lastCall.args).to.deep.equal([reservation, resource, comments]);
      });
    });
  });
});
