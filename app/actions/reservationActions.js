import { CALL_API } from 'redux-api-middleware';

import types from 'constants/ActionTypes';
import {
  buildAPIUrl,
  getErrorTypeDescriptor,
  getHeaders,
  getRequestTypeDescriptor,
  getSuccessTypeDescriptor,
} from 'utils/APIUtils';


export default {
  postReservation,
};

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
      headers: getHeaders(),
      body: JSON.stringify(reservation),
    },
  };
}
