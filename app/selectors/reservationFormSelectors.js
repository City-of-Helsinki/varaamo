import { createSelector } from 'reselect';

import ActionTypes from 'constants/ActionTypes';
import reservationDateSelector from 'selectors/reservationDateSelector';
import selectedReservationsSelector from 'selectors/selectedReservationsSelector';
import modalIsOpenSelectorFactory from 'selectors/factories/modalIsOpenSelectorFactory';
import requestIsActiveSelectorFactory from 'selectors/factories/requestIsActiveSelectorFactory';
import { getOpeningHours } from 'utils/DataUtils';
import { getTimeSlots } from 'utils/TimeUtils';
import ModalTypes from 'constants/ModalTypes';

const idSelector = (state) => state.router.params.id;
const pendingReservationsCountSelector = (state) => state.api.pendingReservationsCount;
const resourcesSelector = (state) => state.data.resources;
const selectedSelector = (state) => state.ui.reservation.selected;

export const reservationFormSelectors = createSelector(
  idSelector,
  modalIsOpenSelectorFactory(ModalTypes.CONFIRM_RESERVATION),
  pendingReservationsCountSelector,
  requestIsActiveSelectorFactory(ActionTypes.API.RESOURCE_GET_REQUEST),
  reservationDateSelector,
  resourcesSelector,
  selectedSelector,
  selectedReservationsSelector,
  (
    id,
    confirmReservationModalIsOpen,
    pendingReservationsCount,
    isFetchingResource,
    reservationDate,
    resources,
    selected,
    selectedReservations
  ) => {
    const resource = resources[id] || {};
    const { closes, opens } = getOpeningHours(resource);
    const period = resource.minPeriod ? resource.minPeriod : undefined;
    const reservations = resource.reservations || undefined;
    const timeSlots = getTimeSlots(opens, closes, period, reservations);

    return {
      confirmReservationModalIsOpen,
      date: reservationDate,
      id,
      isFetchingResource,
      isMakingReservations: Boolean(pendingReservationsCount),
      selected,
      selectedReservations,
      timeSlots,
    };
  }
);
