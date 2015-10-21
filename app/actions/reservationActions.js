import { CALL_API } from 'redux-api-middleware';

import types from 'constants/ActionTypes';
import { buildAPIUrl, getHeaders } from 'utils/APIUtils';

export default {
  makeReservation,
};

function makeReservation(reservation) {
  const url = buildAPIUrl('reservation');

  return {
    [CALL_API]: {
      types: [
        types.API.MAKE_RESERVATION_START,
        types.API.MAKE_RESERVATION_SUCCESS,
        types.API.MAKE_RESERVATION_ERROR,
      ],
      endpoint: url,
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(reservation),
    },
  };
}
