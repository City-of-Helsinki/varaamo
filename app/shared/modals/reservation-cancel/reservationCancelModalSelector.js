import { createSelector } from 'reselect';

import ActionTypes from 'constants/ActionTypes';
import ModalTypes from 'constants/ModalTypes';
import isAdminSelector from 'state/selectors/isAdminSelector';
import modalIsOpenSelectorFactory from 'state/selectors/factories/modalIsOpenSelectorFactory';
import requestIsActiveSelectorFactory from 'state/selectors/factories/requestIsActiveSelectorFactory';

const toCancelSelector = state => state.ui.reservations.toCancel;
const resourcesSelector = state => state.data.resources;

const reservationCancelModalSelector = createSelector(
  isAdminSelector,
  requestIsActiveSelectorFactory(ActionTypes.API.RESERVATION_DELETE_REQUEST),
  modalIsOpenSelectorFactory(ModalTypes.RESERVATION_CANCEL),
  resourcesSelector,
  toCancelSelector,
  (
    isAdmin,
    isCancellingReservations,
    cancelReservationModalIsOpen,
    resources,
    reservationsToCancel
  ) => ({
    isAdmin,
    isCancellingReservations,
    reservationsToCancel,
    resources,
    show: cancelReservationModalIsOpen,
  })
);

export default reservationCancelModalSelector;
