import { arrayOf } from 'normalizr';
import { CALL_API } from 'redux-api-middleware';

import types from 'constants/ActionTypes';
import { unitSchema } from 'middleware/Schemas';
import {
  buildAPIUrl,
  createTransformFunction,
  getHeaders,
} from 'utils/APIUtils';

export default {
  fetchUnits,
};

function fetchUnits() {
  return {
    [CALL_API]: {
      types: [
        types.FETCH_UNITS_START,
        types.FETCH_UNITS_SUCCESS,
        types.FETCH_UNITS_ERROR,
      ],
      endpoint: buildAPIUrl('unit'),
      method: 'GET',
      headers: getHeaders(),
      transform: createTransformFunction(arrayOf(unitSchema)),
      bailout: (state) => {
        return !state.api.shouldFetchUnits;
      },
    },
  };
}
