import Immutable from 'seamless-immutable';

import types from 'constants/ActionTypes';

const initialState = Immutable({
  activeRequests: {},
  shouldFetchPurposes: true,
  shouldFetchSearchResults: true,
  shouldFetchUnits: true,
});

function apiReducer(state = initialState, action) {
  if (action.meta && action.meta.API_ACTION) {
    const { apiRequestStart, apiRequestFinish, countable, type } = action.meta.API_ACTION;
    const activeRequests = state.activeRequests;
    let nextActiveRequests;

    if (apiRequestStart) {
      if (activeRequests[type]) {
        nextActiveRequests = Object.assign({}, activeRequests, { [type]: activeRequests[type] + 1 });
      } else {
        nextActiveRequests = Object.assign({}, activeRequests, { [type]: 1 });
      }
    }

    if (apiRequestFinish) {
      if (activeRequests[type]) {
        if (countable) {
          nextActiveRequests = Object.assign({}, activeRequests, { [type]: activeRequests[type] - 1 });
        } else {
          nextActiveRequests = Object.assign({}, activeRequests, { [type]: 0 });
        }
      } else {
        nextActiveRequests = Object.assign({}, activeRequests, { [type]: 0 });
      }
    }

    return state.merge({ activeRequests: nextActiveRequests || activeRequests });
  }

  switch (action.type) {

  case types.API.PURPOSES_GET_SUCCESS:
    return state.merge({
      shouldFetchPurposes: false,
    });

  case types.API.RESOURCES_GET_SUCCESS:
    return state.merge({
      shouldFetchSearchResults: false,
    });

  case types.API.UNITS_GET_SUCCESS:
    return state.merge({
      shouldFetchUnits: false,
    });

  case types.UI.CHANGE_SEARCH_FILTERS:
    return state.merge({
      shouldFetchSearchResults: true,
    });

  default:
    return state;
  }
}

export default apiReducer;
