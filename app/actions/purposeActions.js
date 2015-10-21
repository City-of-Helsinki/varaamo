import { CALL_API } from 'redux-api-middleware';

import types from 'constants/ActionTypes';
import { paginatedPurposesSchema } from 'middleware/Schemas';
import {
  buildAPIUrl,
  getHeaders,
  getSuccessTypeDescriptor,
} from 'utils/APIUtils';

export default {
  fetchPurposes,
};

function fetchPurposes() {
  return {
    [CALL_API]: {
      types: [
        types.API.FETCH_PURPOSES_START,
        getSuccessTypeDescriptor(
          types.API.FETCH_PURPOSES_SUCCESS,
          paginatedPurposesSchema
        ),
        types.API.FETCH_PURPOSES_ERROR,
      ],
      endpoint: buildAPIUrl('purpose'),
      method: 'GET',
      headers: getHeaders(),
      bailout: (state) => {
        return !state.api.shouldFetchPurposes;
      },
    },
  };
}
