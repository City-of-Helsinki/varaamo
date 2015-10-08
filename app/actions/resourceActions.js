import { arrayOf } from 'normalizr';
import { CALL_API } from 'redux-api-middleware';

import { API_URL } from 'constants/AppConstants';
import types from 'constants/ActionTypes';
import { resourceSchema } from 'middleware/Schemas';
import { buildAPIUrl, createTransformFunction } from 'utils/APIUtils';
import { pickSupportedFilters } from 'utils/DataUtils';

export default {
  fetchResource,
  fetchResources,
};

function fetchResource(id) {
  return {
    [CALL_API]: {
      types: [
        types.FETCH_RESOURCE_START,
        types.FETCH_RESOURCE_SUCCESS,
        types.FETCH_RESOURCE_ERROR,
      ],
      endpoint: `${API_URL}/resource/${id}`,
      method: 'GET',
      transform: createTransformFunction(resourceSchema),
    },
  };
}

function fetchResources(filters = {}) {
  const url = buildAPIUrl('resource', pickSupportedFilters(filters));

  return {
    [CALL_API]: {
      types: [
        types.FETCH_RESOURCES_START,
        types.FETCH_RESOURCES_SUCCESS,
        types.FETCH_RESOURCES_ERROR,
      ],
      endpoint: url,
      method: 'GET',
      transform: createTransformFunction(arrayOf(resourceSchema)),
      bailout: (state) => {
        return !state.api.shouldFetchSearchResults;
      },
    },
  };
}
