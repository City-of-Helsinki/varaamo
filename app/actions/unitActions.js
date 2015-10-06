import { arrayOf } from 'normalizr';
import { CALL_API } from 'redux-api-middleware';

import { API_URL } from 'constants/AppConstants';
import types from 'constants/ActionTypes';
import { unitSchema } from 'middleware/Schemas';
import { createTransformFunction } from 'utils/APIUtils';

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
      endpoint: `${API_URL}/unit`,
      method: 'GET',
      transform: createTransformFunction(arrayOf(unitSchema)),
      bailout: (state) => {
        return !state.api.shouldFetchUnits;
      },
    },
  };
}
