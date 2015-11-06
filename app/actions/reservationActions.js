import { CALL_API } from 'redux-api-middleware';

import types from 'constants/ActionTypes';
import { paginatedReservationsSchema } from 'middleware/Schemas';
import {
  buildAPIUrl,
  getErrorTypeDescriptor,
  getHeadersCreator,
  getRequestTypeDescriptor,
  getSuccessTypeDescriptor,
} from 'utils/APIUtils';

export default {
  deleteReservation,
  fetchReservations,
  postReservation,
  putReservation,
};

function deleteReservation(reservation) {
  return {
    [CALL_API]: {
      types: [
        getRequestTypeDescriptor(
          types.API.RESERVATION_DELETE_REQUEST,
          { countable: true }
        ),
        getSuccessTypeDescriptor(
          types.API.RESERVATION_DELETE_SUCCESS,
          {
            countable: true,
            payload: () => reservation,
          }
        ),
        getErrorTypeDescriptor(
          types.API.RESERVATION_DELETE_ERROR,
          { countable: true }
        ),
      ],
      endpoint: reservation.url,
      method: 'DELETE',
      headers: getHeadersCreator(),
    },
  };
}

function fetchReservations(params = {}) {
  const fetchParams = Object.assign({}, params, { pageSize: 100 });

  return {
    [CALL_API]: {
      types: [
        getRequestTypeDescriptor(types.API.RESERVATIONS_GET_REQUEST),
        getSuccessTypeDescriptor(
          types.API.RESERVATIONS_GET_SUCCESS,
          { schema: paginatedReservationsSchema }
        ),
        getErrorTypeDescriptor(types.API.RESERVATIONS_GET_ERROR),
      ],
      endpoint: buildAPIUrl('reservation', fetchParams),
      method: 'GET',
      headers: getHeadersCreator(),
    },
  };
}

function postReservation(reservation) {
  const url = buildAPIUrl('reservation');

  return {
    [CALL_API]: {
      types: [
        getRequestTypeDescriptor(
          types.API.RESERVATION_POST_REQUEST,
          { countable: true }
        ),
        getSuccessTypeDescriptor(
          types.API.RESERVATION_POST_SUCCESS,
          { countable: true }
        ),
        getErrorTypeDescriptor(
          types.API.RESERVATION_POST_ERROR,
          { countable: true }
        ),
      ],
      endpoint: url,
      method: 'POST',
      headers: getHeadersCreator({}, { withJWT: true }),
      body: JSON.stringify(reservation),
    },
  };
}

function putReservation(reservation) {
  return {
    [CALL_API]: {
      types: [
        getRequestTypeDescriptor(
          types.API.RESERVATION_PUT_REQUEST,
          { countable: true }
        ),
        getSuccessTypeDescriptor(
          types.API.RESERVATION_PUT_SUCCESS,
          { countable: true }
        ),
        getErrorTypeDescriptor(
          types.API.RESERVATION_PUT_ERROR,
          { countable: true }
        ),
      ],
      endpoint: reservation.url,
      method: 'PUT',
      headers: getHeadersCreator(),
      body: JSON.stringify(reservation),
    },
  };
}
