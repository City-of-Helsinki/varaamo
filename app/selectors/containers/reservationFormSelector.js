import { createSelector } from 'reselect';

import ActionTypes from 'constants/ActionTypes';
import reservationDateSelector from 'selectors/reservationDateSelector';
import resourceSelector from 'selectors/resourceSelector';
import selectedReservationsSelector from 'selectors/selectedReservationsSelector';
import modalIsOpenSelectorFactory from 'selectors/factories/modalIsOpenSelectorFactory';
import requestIsActiveSelectorFactory from 'selectors/factories/requestIsActiveSelectorFactory';
import { getOpeningHours } from 'utils/DataUtils';
import { getTimeSlots } from 'utils/TimeUtils';
import ModalTypes from 'constants/ModalTypes';

const idSelector = (state) => state.router.params.id;
const selectedSelector = (state) => state.ui.reservation.selected;
const toEditSelector = (state) => state.ui.reservation.toEdit;

const reservationFormSelector = createSelector(
  idSelector,
  modalIsOpenSelectorFactory(ModalTypes.CONFIRM_RESERVATION),
  requestIsActiveSelectorFactory(ActionTypes.API.RESERVATION_POST_REQUEST),
  requestIsActiveSelectorFactory(ActionTypes.API.RESOURCE_GET_REQUEST),
  reservationDateSelector,
  resourceSelector,
  selectedSelector,
  selectedReservationsSelector,
  toEditSelector,
  (
    id,
    confirmReservationModalIsOpen,
    isMakingReservations,
    isFetchingResource,
    reservationDate,
    resource,
    selected,
    selectedReservations,
    reservationsToEdit
  ) => {
    const { closes, opens } = getOpeningHours(resource);
    const period = resource.minPeriod ? resource.minPeriod : undefined;
    const reservations = resource.reservations || undefined;
    const timeSlots = getTimeSlots(opens, closes, period, reservations, reservationsToEdit);

    return {
      confirmReservationModalIsOpen,
      date: reservationDate,
      id,
      isFetchingResource,
      isMakingReservations,
      reservationsToEdit,
      selected,
      selectedReservations,
      timeSlots,
    };
  }
);

export default reservationFormSelector;
