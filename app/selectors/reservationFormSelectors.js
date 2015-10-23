import _ from 'lodash';
import { createSelector } from 'reselect';

import types from 'constants/ActionTypes';
import reservationDateSelector from 'selectors/reservationDateSelector';
import selectedReservationsSelector from 'selectors/selectedReservationsSelector';
import { getOpeningHours } from 'utils/DataUtils';
import { getTimeSlots } from 'utils/TimeUtils';
import ModalTypes from 'constants/ModalTypes';

const activeRequestsSelector = (state) => state.api.activeRequests;
const idSelector = (state) => state.router.params.id;
const openModalsSelector = (state) => state.ui.modals.open;
const pendingReservationsCountSelector = (state) => state.api.pendingReservationsCount;
const resourcesSelector = (state) => state.data.resources;
const selectedSelector = (state) => state.ui.reservation.selected;

export const reservationFormSelectors = createSelector(
  activeRequestsSelector,
  idSelector,
  openModalsSelector,
  pendingReservationsCountSelector,
  reservationDateSelector,
  resourcesSelector,
  selectedSelector,
  selectedReservationsSelector,
  (
    activeRequests,
    id,
    openModals,
    pendingReservationsCount,
    reservationDate,
    resources,
    selected,
    selectedReservations
  ) => {
    const confirmReservationModalIsOpen = _.includes(openModals, ModalTypes.CONFIRM_RESERVATION);
    const isFetchingResource = _.includes(activeRequests, types.API.RESOURCE_GET_REQUEST);
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
