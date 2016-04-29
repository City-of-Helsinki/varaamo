import filter from 'lodash/collection/filter';
import includes from 'lodash/collection/includes';
import { createSelector } from 'reselect';

import ActionTypes from 'constants/ActionTypes';
import dateSelector from 'selectors/dateSelector';
import isLoggedInSelector from 'selectors/isLoggedInSelector';
import resourceSelector from 'selectors/resourceSelector';
import timeSelector from 'selectors/timeSelector';
import selectedReservationsSelector from 'selectors/selectedReservationsSelector';
import modalIsOpenSelectorFactory from 'selectors/factories/modalIsOpenSelectorFactory';
import requestIsActiveSelectorFactory from 'selectors/factories/requestIsActiveSelectorFactory';
import { getOpeningHours } from 'utils/DataUtils';
import { getTimeSlots } from 'utils/TimeUtils';
import ModalTypes from 'constants/ModalTypes';

const idSelector = (state, props) => props.params.id;
const selectedSelector = (state) => state.ui.reservation.selected;
const toEditSelector = (state) => state.ui.reservation.toEdit;
const urlHashSelector = (state, props) => props.location.hash;

const reservationCalendarSelector = createSelector(
  idSelector,
  isLoggedInSelector,
  modalIsOpenSelectorFactory(ModalTypes.RESERVATION_CONFIRM),
  requestIsActiveSelectorFactory(ActionTypes.API.RESERVATION_POST_REQUEST),
  requestIsActiveSelectorFactory(ActionTypes.API.RESOURCE_GET_REQUEST),
  dateSelector,
  resourceSelector,
  selectedSelector,
  selectedReservationsSelector,
  timeSelector,
  toEditSelector,
  urlHashSelector,
  (
    id,
    isLoggedIn,
    confirmReservationModalIsOpen,
    isMakingReservations,
    isFetchingResource,
    date,
    resource,
    selected,
    selectedReservations,
    time,
    reservationsToEdit,
    urlHash
  ) => {
    const { closes, opens } = getOpeningHours(resource);
    const period = resource.minPeriod ? resource.minPeriod : undefined;
    const reservations = resource.reservations || undefined;
    const openReservations = filter(reservations, (reservation) => {
      const openStates = ['confirmed', 'requested'];
      return includes(openStates, reservation.state);
    });
    const timeSlots = getTimeSlots(opens, closes, period, openReservations, reservationsToEdit);

    return {
      confirmReservationModalIsOpen,
      date,
      id,
      isFetchingResource,
      isLoggedIn,
      isMakingReservations,
      reservationsToEdit,
      resource,
      selected,
      selectedReservations,
      time,
      timeSlots,
      urlHash,
    };
  }
);

export default reservationCalendarSelector;
