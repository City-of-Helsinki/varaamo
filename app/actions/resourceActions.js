import fetch from 'isomorphic-fetch';

import {API_URL} from 'constants/AppConstants';
import types from 'constants/ActionTypes';

export default {
  fetchResources,
  fetchResourcesStart,
  fetchResourcesSuccess,
};

function fetchResourcesStart() {
  return {
    type: types.FETCH_RESOURCES_START,
  };
}

function fetchResourcesSuccess(resources) {
  return {
    type: types.FETCH_RESOURCES_SUCCESS,
    payload: {resources},
  };
}

function fetchResources() {
  return (dispatch) => {
    dispatch(fetchResourcesStart());

    return fetch(`${API_URL}/resource`)
      .then((response) => response.json())
      .then((json) => {
        dispatch(fetchResourcesSuccess(json));
      });
  };
}
