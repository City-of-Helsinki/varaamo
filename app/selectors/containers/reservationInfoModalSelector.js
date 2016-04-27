import { createSelector } from 'reselect';

import ActionTypes from 'constants/ActionTypes';
import ModalTypes from 'constants/ModalTypes';
import modalIsOpenSelectorFactory from 'selectors/factories/modalIsOpenSelectorFactory';
import requestIsActiveSelectorFactory from 'selectors/factories/requestIsActiveSelectorFactory';

const toShowSelector = (state) => state.ui.reservation.toShow;
const resourcesSelector = (state) => state.data.resources;

const reservationInfoModalSelector = createSelector(
  modalIsOpenSelectorFactory(ModalTypes.RESERVATION_INFO),
  requestIsActiveSelectorFactory(ActionTypes.API.RESERVATION_PUT_REQUEST),
  resourcesSelector,
  toShowSelector,
  (
    reservationInfoModalIsOpen,
    isEditingReservations,
    resources,
    reservationsToShow
  ) => {
    return {
      isEditingReservations,
      reservationsToShow,
      resources,
      show: reservationInfoModalIsOpen,
    };
  }
);

export default reservationInfoModalSelector;
