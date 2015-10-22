import { CALL_API } from 'redux-api-middleware';

import types from 'constants/ActionTypes';
import { buildAPIUrl, getHeaders } from 'utils/APIUtils';

export default {
  postReservation,
};

function postReservation(reservation) {
  const url = buildAPIUrl('reservation');

  return {
    [CALL_API]: {
      types: [
        types.API.RESERVATION_POST_REQUEST,
        types.API.RESERVATION_POST_SUCCESS,
        types.API.RESERVATION_POST_ERROR,
      ],
      endpoint: url,
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(reservation),
    },
  };
}
