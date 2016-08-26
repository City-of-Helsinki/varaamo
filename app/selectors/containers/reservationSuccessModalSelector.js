import { createSelector } from 'reselect';

import ModalTypes from 'constants/ModalTypes';
import modalIsOpenSelectorFactory from 'selectors/factories/modalIsOpenSelectorFactory';

const resourcesSelector = (state) => state.data.resources;
const toShowSelector = (state) => state.ui.reservations.toShow;

const reservationSuccessModalSelector = createSelector(
  resourcesSelector,
  toShowSelector,
  modalIsOpenSelectorFactory(ModalTypes.RESERVATION_SUCCESS),
  (
    resources,
    reservationsToShow,
    show
  ) => {
    return {
      reservationsToShow,
      resources,
      show,
    };
  }
);

export default reservationSuccessModalSelector;
