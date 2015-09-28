import {CALL_API} from 'redux-api-middleware';

import {API_URL} from 'constants/AppConstants';
import types from 'constants/ActionTypes';

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
    },
  };
}

function fetchResources() {
  return {
    [CALL_API]: {
      types: [
        types.FETCH_RESOURCES_START,
        types.FETCH_RESOURCES_SUCCESS,
        types.FETCH_RESOURCES_ERROR,
      ],
      endpoint: `${API_URL}/resource`,
      method: 'GET',
    },
  };
}
