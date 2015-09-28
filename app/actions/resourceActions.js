import fetch from 'isomorphic-fetch';

import {API_URL} from 'constants/AppConstants';
import types from 'constants/ActionTypes';

export default {
  fetchResource,
  fetchResourceStart,
  fetchResourceSuccess,
  fetchResources,
  fetchResourcesStart,
  fetchResourcesSuccess,
};

function fetchResourceStart() {
  return {
    type: types.FETCH_RESOURCE_START,
  };
}

function fetchResourceSuccess(resource) {
  return {
    type: types.FETCH_RESOURCE_SUCCESS,
    payload: {resource},
  };
}

function fetchResource(id) {
  return (dispatch) => {
    dispatch(fetchResourceStart());

    return fetch(`${API_URL}/resource/${id}`)
      .then((response) => response.json())
      .then((json) => {
        dispatch(fetchResourceSuccess(json));
      });
  };
}

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
