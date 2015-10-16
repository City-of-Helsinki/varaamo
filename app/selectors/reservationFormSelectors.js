import _ from 'lodash';
import { createSelector } from 'reselect';
import Immutable from 'seamless-immutable';

import {
  combineReservations,
  getOpeningHours,
} from 'utils/DataUtils';
import { getTimeSlots } from 'utils/TimeUtils';
import ModalTypes from 'constants/ModalTypes';

const dateSelector = (state) => state.ui.reservation.date;
const idSelector = (state) => state.router.params.id;
const isFetchingResourceSelector = (state) => state.api.isFetchingResource;
const openModalsSelector = (state) => state.ui.modals.open;
const pendingReservationsCountSelector = (state) => state.api.pendingReservationsCount;
const resourcesSelector = (state) => state.data.resources;
const selectedSelector = (state) => state.ui.reservation.selected;

export const reservationFormSelectors = createSelector(
  dateSelector,
  idSelector,
  isFetchingResourceSelector,
  openModalsSelector,
  pendingReservationsCountSelector,
  resourcesSelector,
  selectedSelector,
  (
    date,
    id,
    isFetchingResource,
    openModals,
    pendingReservationsCount,
    resources,
    selected
  ) => {
    const confirmReservationModalIsOpen = _.includes(openModals, ModalTypes.CONFIRM_RESERVATION);
    const resource = resources[id] || {};
    const { closes, opens } = getOpeningHours(resource);
    const period = resource.minPeriod ? resource.minPeriod : undefined;
    const reservations = resource.reservations || undefined;
    const timeSlots = getTimeSlots(opens, closes, period, reservations);

    const selectedSlots = selected.map(current => {
      return {
        begin: current.split('/')[0],
        end: current.split('/')[1],
        resource: id,
      };
    });
    const selectedReservations = Immutable(combineReservations(selectedSlots));

    return {
      confirmReservationModalIsOpen,
      date,
      id,
      isFetchingResource,
      isMakingReservations: Boolean(pendingReservationsCount),
      resource,
      selected,
      selectedReservations,
      timeSlots,
    };
  }
);
