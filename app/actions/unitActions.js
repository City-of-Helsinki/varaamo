import { CALL_API } from 'redux-api-middleware';

import types from 'constants/ActionTypes';
import { paginatedUnitsSchema } from 'middleware/Schemas';
import {
  buildAPIUrl,
  createTransformFunction,
  getHeaders,
} from 'utils/APIUtils';

export default {
  fetchUnits,
};

function fetchUnits() {
  const fetchParams = { pageSize: 100 };

  return {
    [CALL_API]: {
      types: [
        types.FETCH_UNITS_START,
        types.FETCH_UNITS_SUCCESS,
        types.FETCH_UNITS_ERROR,
      ],
      endpoint: buildAPIUrl('unit', fetchParams),
      method: 'GET',
      headers: getHeaders(),
      transform: createTransformFunction(paginatedUnitsSchema),
      bailout: (state) => {
        return !state.api.shouldFetchUnits;
      },
    },
  };
}
