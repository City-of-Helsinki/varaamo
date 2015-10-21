import { CALL_API } from 'redux-api-middleware';

import types from 'constants/ActionTypes';
import { paginatedUnitsSchema } from 'middleware/Schemas';
import {
  buildAPIUrl,
  getHeaders,
  getSuccessTypeDescriptor,
} from 'utils/APIUtils';

export default {
  fetchUnits,
};

function fetchUnits() {
  const fetchParams = { pageSize: 100 };

  return {
    [CALL_API]: {
      types: [
        types.API.FETCH_UNITS_START,
        getSuccessTypeDescriptor(
          types.API.FETCH_UNITS_SUCCESS,
          paginatedUnitsSchema
        ),
        types.API.FETCH_UNITS_ERROR,
      ],
      endpoint: buildAPIUrl('unit', fetchParams),
      method: 'GET',
      headers: getHeaders(),
      bailout: (state) => {
        return !state.api.shouldFetchUnits;
      },
    },
  };
}
