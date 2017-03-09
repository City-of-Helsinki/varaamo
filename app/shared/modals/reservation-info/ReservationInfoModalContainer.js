import { connect } from 'react-redux';

import {
  commentReservation, confirmPreliminaryReservation, denyPreliminaryReservation,
} from 'actions/reservationActions';
import {
  hideReservationInfoModal, openReservationCancelModal, selectReservationToCancel,
} from 'actions/uiActions';
import ReservationInfoModal from './ReservationInfoModal';
import reservationInfoModalSelector from './reservationInfoModalSelector';

const actions = {
  commentReservation,
  confirmPreliminaryReservation,
  denyPreliminaryReservation,
  hideReservationInfoModal,
  openReservationCancelModal,
  selectReservationToCancel,
};

export function mergeProps(stateProps, dispatchProps) {
  const { reservation, resource } = stateProps;
  return {
    ...stateProps,
    hideReservationInfoModal: dispatchProps.hideReservationInfoModal,
    onCancelClick: () => {
      dispatchProps.selectReservationToCancel(reservation);
      dispatchProps.openReservationCancelModal();
    },
    onConfirmClick: () => dispatchProps.confirmPreliminaryReservation(reservation),
    onDenyClick: () => dispatchProps.denyPreliminaryReservation(reservation),
    onSaveCommentsClick: (comments) => {
      dispatchProps.commentReservation(reservation, resource, comments);
    },
  };
}

export default connect(reservationInfoModalSelector, actions, mergeProps)(ReservationInfoModal);
