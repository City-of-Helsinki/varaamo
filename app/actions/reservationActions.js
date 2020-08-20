import { decamelizeKeys } from 'humps';
import pickBy from 'lodash/pickBy';
import { RSAA } from 'redux-api-middleware';

import types from '../constants/ActionTypes';
import schemas from '../store/middleware/Schemas';
import {
  buildAPIUrl,
  getErrorTypeDescriptor,
  getHeadersCreator,
  getRequestTypeDescriptor,
  getSuccessTypeDescriptor,
} from '../utils/apiUtils';
import { getMissingValues, isStaffEvent } from '../utils/reservationUtils';

function commentReservation(reservation, resource, comments) {
  const missingValues = getMissingValues(reservation);
  const staffEvent = isStaffEvent(reservation, resource);
  return putReservation(Object.assign(
    {},
    reservation,
    missingValues,
    { comments },
    { staffEvent },
  ));
}

function confirmPreliminaryReservation(reservation) {
  return putReservation(Object.assign({}, reservation, { state: 'confirmed' }));
}

function deleteReservation(reservation, cancelReason) {
  return {
    [RSAA]: {
      types: [
        getRequestTypeDescriptor(
          types.API.RESERVATION_DELETE_REQUEST,
          {
            countable: true,
            meta: { track: getTrackingInfo('cancel', reservation.resource) },
          },
        ),
        getSuccessTypeDescriptor(
          types.API.RESERVATION_DELETE_SUCCESS,
          {
            countable: true,
            payload: () => reservation,
          },
        ),
        getErrorTypeDescriptor(
          types.API.RESERVATION_DELETE_ERROR,
          { countable: true },
        ),
      ],
      endpoint: reservation.url,
      method: 'PATCH',
      headers: getHeadersCreator(),
      body: parseReservationData({
        state: 'cancelled',
        cancelReason,
      }),
    },
  };
}

function denyPreliminaryReservation(reservation) {
  return putReservation(Object.assign({}, reservation, { state: 'denied' }));
}

function fetchReservations(params = {}) {
  const fetchParams = Object.assign({}, params);
  if (!fetchParams.pageSize) fetchParams.pageSize = 100;
  return {
    [RSAA]: {
      types: [
        getRequestTypeDescriptor(types.API.RESERVATIONS_GET_REQUEST),
        getSuccessTypeDescriptor(
          types.API.RESERVATIONS_GET_SUCCESS,
          { schema: schemas.paginatedReservationsSchema },
        ),
        getErrorTypeDescriptor(types.API.RESERVATIONS_GET_ERROR),
      ],
      endpoint: buildAPIUrl('reservation', fetchParams),
      method: 'GET',
      headers: getHeadersCreator(),
    },
  };
}

function parseReservationData(reservation) {
  const parsed = pickBy(reservation, value => value || value === 0);
  return JSON.stringify(decamelizeKeys(parsed));
}

function postReservation(reservation) {
  const url = buildAPIUrl('reservation');

  return {
    [RSAA]: {
      types: [
        getRequestTypeDescriptor(
          types.API.RESERVATION_POST_REQUEST,
          {
            countable: true,
            meta: { track: getTrackingInfo('add', reservation.resource) },
          },
        ),
        getSuccessTypeDescriptor(
          types.API.RESERVATION_POST_SUCCESS,
          { countable: true },
        ),
        getErrorTypeDescriptor(
          types.API.RESERVATION_POST_ERROR,
          { countable: true, meta: { reservation } },
        ),
      ],
      endpoint: url,
      method: 'POST',
      headers: getHeadersCreator(),
      body: parseReservationData(reservation),
    },
  };
}

function putReservation(reservation) {
  return {
    [RSAA]: {
      types: [
        getRequestTypeDescriptor(
          types.API.RESERVATION_PUT_REQUEST,
          {
            countable: true,
            meta: { track: getTrackingInfo('edit', reservation.resource) },
          },
        ),
        getSuccessTypeDescriptor(
          types.API.RESERVATION_PUT_SUCCESS,
          { countable: true },
        ),
        getErrorTypeDescriptor(
          types.API.RESERVATION_PUT_ERROR,
          { countable: true },
        ),
      ],
      endpoint: reservation.url,
      method: 'PUT',
      headers: getHeadersCreator(),
      body: parseReservationData(reservation),
    },
  };
}

function getTrackingInfo(type, resource) {
  return ({
    event: 'trackEvent',
    args: [
      'Reservation',
      `reservation-${type}`,
      resource,
    ],
  });
}

/**
 * batchAddReservations();
 * Creates an action that adds a batch of reservations into the redux
 * state.
 * @param reservations {array} Reservations to add.
 * @returns {object}
 */
export function batchAddReservations(reservations) {
  return {
    type: types.DATA.RESERVATION_BATCH_ADD,
    reservations,
  };
}

export {
  commentReservation,
  confirmPreliminaryReservation,
  deleteReservation,
  denyPreliminaryReservation,
  fetchReservations,
  postReservation,
  putReservation,
};
