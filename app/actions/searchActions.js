import { CALL_API } from 'redux-api-middleware';

import types from 'constants/ActionTypes';
import { paginatedResourcesSchema } from 'middleware/Schemas';
import {
  buildAPIUrl,
  getErrorTypeDescriptor,
  getHeadersCreator,
  getRequestTypeDescriptor,
  getSuccessTypeDescriptor,
} from 'utils/APIUtils';

export default {
  searchResources,
};

function searchResources(params = {}) {
  const fetchParams = Object.assign({}, params, { pageSize: 100 });

  return {
    [CALL_API]: {
      types: [
        getRequestTypeDescriptor(types.API.SEARCH_RESULTS_GET_REQUEST),
        getSuccessTypeDescriptor(
          types.API.SEARCH_RESULTS_GET_SUCCESS,
          { schema: paginatedResourcesSchema }
        ),
        getErrorTypeDescriptor(types.API.SEARCH_RESULTS_GET_ERROR),
      ],
      endpoint: buildAPIUrl('resource', fetchParams),
      method: 'GET',
      headers: getHeadersCreator(),
    },
  };
}
