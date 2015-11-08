import { CALL_API } from 'redux-api-middleware';

import types from 'constants/ActionTypes';
import { paginatedPurposesSchema } from 'middleware/Schemas';
import {
  buildAPIUrl,
  getErrorTypeDescriptor,
  getHeadersCreator,
  getRequestTypeDescriptor,
  getSuccessTypeDescriptor,
} from 'utils/APIUtils';

export default {
  fetchPurposes,
};

function fetchPurposes() {
  return {
    [CALL_API]: {
      types: [
        getRequestTypeDescriptor(types.API.PURPOSES_GET_REQUEST),
        getSuccessTypeDescriptor(
          types.API.PURPOSES_GET_SUCCESS,
          { schema: paginatedPurposesSchema }
        ),
        getErrorTypeDescriptor(types.API.PURPOSES_GET_ERROR),
      ],
      endpoint: buildAPIUrl('purpose'),
      method: 'GET',
      headers: getHeadersCreator(),
      bailout: (state) => {
        return !state.api.shouldFetch.purposes;
      },
    },
  };
}
