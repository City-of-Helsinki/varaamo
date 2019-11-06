import { connect } from 'react-redux';
import { reset as resetForm } from 'redux-form';

import { createNotification } from '../../../../src/common/notification/utils';
import { NOTIFICATION_TYPE } from '../../../../src/common/notification/constants';
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
    onConfirmClick: () => dispatchProps.confirmPreliminaryReservation(reservation),
    onDenyClick: () => dispatchProps.denyPreliminaryReservation(reservation),
    onEditFormSubmit: dispatchProps.putReservation,
    onSaveCommentsClick: (comments) => {
      dispatchProps.commentReservation(reservation, resource, comments)
        .then((value) => {
          console.log('onSaveCommentsClick.then(value)', value);
          createNotification(NOTIFICATION_TYPE.SUCCESS, 'Message...', 'Success');
        })
        .catch((error) => {
          console.log('onSaveCommentsClick.error(error)', error);
          createNotification(NOTIFICATION_TYPE.ERROR, 'Message...', 'Error');
        })
        .finally(() => {
          console.log('onSaveCommentsClick.finally');
          createNotification(NOTIFICATION_TYPE.INFO, 'Message...', 'Info');
        });
    },
    onStartEditClick: dispatchProps.startReservationEditInInfoModal,
  };
}

export default connect(reservationInfoModalSelector, actions, mergeProps)(ReservationInfoModal);
