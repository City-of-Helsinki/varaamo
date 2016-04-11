import { createSelector } from 'reselect';

import ModalTypes from 'constants/ModalTypes';
import modalIsOpenSelectorFactory from 'selectors/factories/modalIsOpenSelectorFactory';

const toShowSelector = (state) => state.ui.reservation.toShow;
const resourcesSelector = (state) => state.data.resources;

const reservationInfoModalSelector = createSelector(
  modalIsOpenSelectorFactory(ModalTypes.RESERVATION_INFO),
  resourcesSelector,
  toShowSelector,
  (
    reservationInfoModalIsOpen,
    resources,
    reservationsToShow
  ) => {
    return {
      reservationsToShow,
      resources,
      show: reservationInfoModalIsOpen,
    };
  }
);

export default reservationInfoModalSelector;
