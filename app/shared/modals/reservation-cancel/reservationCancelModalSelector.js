import { createSelector, createStructuredSelector } from 'reselect';

import ActionTypes from '../../../constants/ActionTypes';
import ModalTypes from '../../../constants/ModalTypes';
import { isAdminSelector } from '../../../state/selectors/authSelectors';
import { createResourceSelector } from '../../../state/selectors/dataSelectors';
import modalIsOpenSelectorFactory from '../../../state/selectors/factories/modalIsOpenSelectorFactory';
import requestIsActiveSelectorFactory from '../../../state/selectors/factories/requestIsActiveSelectorFactory';
import { hasProducts } from '../../../utils/resourceUtils';

function reservationSelector(state) {
  return state.ui.reservations.toCancel[0] || {};
}

const resourceIdSelector = createSelector(
  reservationSelector,
  (reservation) => reservation.resource
);

const cancelAllowedSelector = createSelector(
  isAdminSelector,
  createResourceSelector(resourceIdSelector),
  reservationSelector,
  (isAdmin, resource, reservation) =>
    isAdmin ||
    (!reservation.needManualConfirmation && !hasProducts(resource)) ||
    (reservation.state !== 'confirmed' && !hasProducts(resource))
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
