import { createSelector } from 'reselect';

import ModalTypes from 'constants/ModalTypes';
import modalIsOpenSelectorFactory from 'selectors/factories/modalIsOpenSelectorFactory';

const resourcesSelector = (state) => state.data.resources;
const toShowSelector = (state) => state.ui.reservation.toShow;

const reservationSuccessModalSelector = createSelector(
  modalIsOpenSelectorFactory(ModalTypes.RESERVATION_SUCCESS),
  resourcesSelector,
  toShowSelector,
  (
    deleteReservationModalIsOpen,
    resources,
    reservationsToShow
  ) => {
    return {
      reservationsToShow,
      resources,
      show: deleteReservationModalIsOpen,
    };
  }
);

export default reservationSuccessModalSelector;
