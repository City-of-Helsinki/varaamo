import { CALL_API } from 'redux-api-middleware';

import types from 'constants/ActionTypes';
import { paginatedPurposesSchema } from 'middleware/Schemas';
import {
  buildAPIUrl,
  createTransformFunction,
  getHeaders,
} from 'utils/APIUtils';

export default {
  fetchPurposes,
};

function fetchPurposes() {
  return {
    [CALL_API]: {
      types: [
        types.FETCH_PURPOSES_START,
        types.FETCH_PURPOSES_SUCCESS,
        types.FETCH_PURPOSES_ERROR,
      ],
      endpoint: buildAPIUrl('purpose'),
      method: 'GET',
      headers: getHeaders(),
      transform: createTransformFunction(paginatedPurposesSchema),
      bailout: (state) => {
        return !state.api.shouldFetchPurposes;
      },
    },
  };
}
