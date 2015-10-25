import { CALL_API } from 'redux-api-middleware';

import types from 'constants/ActionTypes';
import { paginatedUnitsSchema } from 'middleware/Schemas';
import {
  buildAPIUrl,
  getErrorTypeDescriptor,
  getHeaders,
  getRequestTypeDescriptor,
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
        getRequestTypeDescriptor(types.API.UNITS_GET_REQUEST),
        getSuccessTypeDescriptor(
          types.API.UNITS_GET_SUCCESS,
          { schema: paginatedUnitsSchema }
        ),
        getErrorTypeDescriptor(types.API.UNITS_GET_ERROR),
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
