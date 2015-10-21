import { CALL_API } from 'redux-api-middleware';

import types from 'constants/ActionTypes';
import { paginatedResourcesSchema, resourceSchema } from 'middleware/Schemas';
import {
  buildAPIUrl,
  getHeaders,
  getSuccessTypeDescriptor,
} from 'utils/APIUtils';

export default {
  fetchResource,
  fetchResources,
};

function fetchResource(id, params = {}) {
  return {
    [CALL_API]: {
      types: [
        types.API.FETCH_RESOURCE_START,
        getSuccessTypeDescriptor(
          types.API.FETCH_RESOURCE_SUCCESS,
          resourceSchema
        ),
        types.API.FETCH_RESOURCE_ERROR,
      ],
      endpoint: buildAPIUrl(`resource/${id}`, params),
      method: 'GET',
      headers: getHeaders(),
    },
  };
}

function fetchResources(params = {}) {
  const fetchParams = Object.assign({}, params, { pageSize: 100 });

  return {
    [CALL_API]: {
      types: [
        types.API.FETCH_RESOURCES_START,
        getSuccessTypeDescriptor(
          types.API.FETCH_RESOURCES_SUCCESS,
          paginatedResourcesSchema
        ),
        types.API.FETCH_RESOURCES_ERROR,
      ],
      endpoint: buildAPIUrl('resource', fetchParams),
      method: 'GET',
      headers: getHeaders(),
      bailout: (state) => {
        return !state.api.shouldFetchSearchResults;
      },
    },
  };
}
