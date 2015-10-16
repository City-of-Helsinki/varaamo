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
        types.MAKE_RESERVATION_START,
        types.MAKE_RESERVATION_SUCCESS,
        types.MAKE_RESERVATION_ERROR,
      ],
      endpoint: url,
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(reservation),
    },
  };
}
