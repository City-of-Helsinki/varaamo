import { createSelector } from 'reselect';

import ActionTypes from 'constants/ActionTypes';
import ModalTypes from 'constants/ModalTypes';
import modalIsOpenSelectorFactory from 'state/selectors/factories/modalIsOpenSelectorFactory';
import requestIsActiveSelectorFactory from 'state/selectors/factories/requestIsActiveSelectorFactory';

const reservationsToShowSelector = state => state.ui.reservations.toShow;
const resourcesSelector = state => state.data.resources;

const commentModalSelector = createSelector(
  requestIsActiveSelectorFactory(ActionTypes.API.RESERVATION_PUT_REQUEST),
  modalIsOpenSelectorFactory(ModalTypes.RESERVATION_COMMENT),
  reservationsToShowSelector,
  resourcesSelector,
  (
    isEditingReservations,
    reservationInfoModalIsOpen,
    reservationsToShow,
    resources,
  ) => {
    const reservation = reservationsToShow[0] || {};
    const resource = reservation.resource ? resources[reservation.resource] : {};
    return {
      isEditingReservations,
      reservation,
      resource,
      show: reservationInfoModalIsOpen,
    };
  }
);

export default commentModalSelector;
