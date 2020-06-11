import { connect } from 'react-redux';
import { reset as resetForm } from 'redux-form';
import { withRouter } from 'react-router-dom';

import FormTypes from '../../../constants/FormTypes';
import {
  commentReservation,
  confirmPreliminaryReservation,
  denyPreliminaryReservation,
  putReservation,
} from '../../../actions/reservationActions';
import {
  cancelReservationEditInInfoModal,
  hideReservationInfoModal,
  openReservationCancelModal,
  selectReservationToCancel,
  startReservationEditInInfoModal,
  selectReservationToEdit,
} from '../../../actions/uiActions';
import ReservationInfoModal from './ReservationInfoModal';
import reservationInfoModalSelector from './reservationInfoModalSelector';

const actions = {
  cancelReservationEditInInfoModal,
  commentReservation,
  confirmPreliminaryReservation,
  denyPreliminaryReservation,
  hideReservationInfoModal,
  openReservationCancelModal,
  resetForm,
  putReservation,
  selectReservationToCancel,
  startReservationEditInInfoModal,
  selectReservationToEdit,
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
    onCancelEditClick: () => {
      dispatchProps.cancelReservationEditInInfoModal();
      dispatchProps.resetForm(FormTypes.RESERVATION_EDIT);
    },
    onConfirmClick: () =>
      dispatchProps.confirmPreliminaryReservation(reservation),
    onDenyClick: () => dispatchProps.denyPreliminaryReservation(reservation),
    onEditFormSubmit: dispatchProps.putReservation,
    onSaveCommentsClick: (comments) => {
      dispatchProps.commentReservation(reservation, resource, comments);
    },
    selectReservationToEdit: dispatchProps.selectReservationToEdit,
  };
}

export default connect(
  reservationInfoModalSelector,
  actions,
  mergeProps
)(withRouter(ReservationInfoModal));
