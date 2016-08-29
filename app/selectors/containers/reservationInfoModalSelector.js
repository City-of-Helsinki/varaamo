import { createSelector } from 'reselect';

import ActionTypes from 'constants/ActionTypes';
import ModalTypes from 'constants/ModalTypes';
import staffUnitsSelector from 'selectors/staffUnitsSelector';
import modalIsOpenSelectorFactory from 'selectors/factories/modalIsOpenSelectorFactory';
import requestIsActiveSelectorFactory from 'selectors/factories/requestIsActiveSelectorFactory';

const toShowSelector = (state) => state.ui.reservations.toShow;
const resourcesSelector = (state) => state.data.resources;

const reservationInfoModalSelector = createSelector(
  requestIsActiveSelectorFactory(ActionTypes.API.RESERVATION_PUT_REQUEST),
  modalIsOpenSelectorFactory(ModalTypes.RESERVATION_INFO),
  toShowSelector,
  resourcesSelector,
  staffUnitsSelector,
  (
    isEditingReservations,
    reservationInfoModalIsOpen,
    reservationsToShow,
    resources,
    staffUnits
  ) => ({
    isEditingReservations,
    reservationsToShow,
    resources,
    show: reservationInfoModalIsOpen,
    staffUnits,
  })
);

export default reservationInfoModalSelector;
