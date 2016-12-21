import { createSelector, createStructuredSelector } from 'reselect';

import ActionTypes from 'constants/ActionTypes';
import ModalTypes from 'constants/ModalTypes';
import { isAdminSelector } from 'state/selectors/authSelectors';
import { createResourceSelector } from 'state/selectors/dataSelectors';
import modalIsOpenSelectorFactory from 'state/selectors/factories/modalIsOpenSelectorFactory';
import requestIsActiveSelectorFactory from 'state/selectors/factories/requestIsActiveSelectorFactory';

function reservationSelector(state) {
  return state.ui.reservations.toCancel[0] || {};
}

const resourceIdSelector = createSelector(
  reservationSelector,
  reservation => reservation.resource
);

const cancelAllowedSelector = createSelector(
  isAdminSelector,
  reservationSelector,
  (isAdmin, reservation) => (
    isAdmin || !reservation.needManualConfirmation || reservation.state !== 'confirmed'
  )
);

const reservationCancelModalSelector = createStructuredSelector({
  cancelAllowed: cancelAllowedSelector,
  isCancellingReservations: requestIsActiveSelectorFactory(
    ActionTypes.API.RESERVATION_DELETE_REQUEST
  ),
  reservation: reservationSelector,
  resource: createResourceSelector(resourceIdSelector),
  show: modalIsOpenSelectorFactory(ModalTypes.RESERVATION_CANCEL),
});

export default reservationCancelModalSelector;
