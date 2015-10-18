import { CALL_API } from 'redux-api-middleware';

import types from 'constants/ActionTypes';
import { paginatedResourcesSchema, resourceSchema } from 'middleware/Schemas';
import {
  buildAPIUrl,
  createTransformFunction,
  getHeaders,
} from 'utils/APIUtils';

export default {
  fetchResource,
  fetchResources,
};

function fetchResource(id, params = {}) {
  return {
    [CALL_API]: {
      types: [
        types.FETCH_RESOURCE_START,
        types.FETCH_RESOURCE_SUCCESS,
        types.FETCH_RESOURCE_ERROR,
      ],
      endpoint: buildAPIUrl(`resource/${id}`, params),
      method: 'GET',
      headers: getHeaders(),
      transform: createTransformFunction(resourceSchema),
    },
  };
}

function fetchResources(params = {}) {
  const fetchParams = Object.assign({}, params, { pageSize: 100 });

  return {
    [CALL_API]: {
      types: [
        types.FETCH_RESOURCES_START,
        types.FETCH_RESOURCES_SUCCESS,
        types.FETCH_RESOURCES_ERROR,
      ],
      endpoint: buildAPIUrl('resource', fetchParams),
      method: 'GET',
      headers: getHeaders(),
      transform: createTransformFunction(paginatedResourcesSchema),
      bailout: (state) => {
        return !state.api.shouldFetchSearchResults;
      },
    },
  };
}
