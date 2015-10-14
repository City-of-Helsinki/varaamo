import { CALL_API } from 'redux-api-middleware';

import types from 'constants/ActionTypes';
import { buildAPIUrl } from 'utils/APIUtils';

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
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reservation),
    },
  };
}
