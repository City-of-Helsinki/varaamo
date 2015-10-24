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

const pendingReservationsCountSelector = (state) => state.api.pendingReservationsCount;
const selectedSelector = (state) => state.ui.reservation.selected;

const reservationFormSelector = createSelector(
  modalIsOpenSelectorFactory(ModalTypes.CONFIRM_RESERVATION),
  pendingReservationsCountSelector,
  requestIsActiveSelectorFactory(ActionTypes.API.RESOURCE_GET_REQUEST),
  reservationDateSelector,
  resourceSelector,
  selectedSelector,
  selectedReservationsSelector,
  (
    confirmReservationModalIsOpen,
    pendingReservationsCount,
    isFetchingResource,
    reservationDate,
    resource,
    selected,
    selectedReservations
  ) => {
    const { closes, opens } = getOpeningHours(resource);
    const period = resource.minPeriod ? resource.minPeriod : undefined;
    const reservations = resource.reservations || undefined;
    const timeSlots = getTimeSlots(opens, closes, period, reservations);

    return {
      confirmReservationModalIsOpen,
      date: reservationDate,
      id: resource.id,
      isFetchingResource,
      isMakingReservations: Boolean(pendingReservationsCount),
      selected,
      selectedReservations,
      timeSlots,
    };
  }
);

export default reservationFormSelector;
