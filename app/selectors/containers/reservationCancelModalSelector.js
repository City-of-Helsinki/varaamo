import { createSelector } from 'reselect';

import ModalTypes from 'constants/ModalTypes';
import modalIsOpenSelectorFactory from 'selectors/factories/modalIsOpenSelectorFactory';

const toCancelSelector = (state) => state.ui.reservation.toCancel;
const resourcesSelector = (state) => state.data.resources;

const reservationCancelModalSelector = createSelector(
  modalIsOpenSelectorFactory(ModalTypes.CANCEL_RESERVATION),
  resourcesSelector,
  toCancelSelector,
  (
    cancelReservationModalIsOpen,
    resources,
    reservationsToCancel
  ) => {
    return {
      reservationsToCancel,
      resources,
      show: cancelReservationModalIsOpen,
    };
  }
);

export default reservationCancelModalSelector;
