import Immutable from 'seamless-immutable';

import ActionTypes from 'constants/ActionTypes';

const initialState = Immutable({
  isFetchingSearchResults: false,
  isFetchingPurposes: false,
  isFetchingResource: false,
  shouldFetchPurposes: true,
  shouldFetchSearchResults: true,
  shouldFetchUnits: true,
});

export function apiReducer(state = initialState, action) {
  switch (action.type) {

  case ActionTypes.CHANGE_SEARCH_FILTERS:
    return state.merge({
      shouldFetchSearchResults: true,
    });

  case ActionTypes.FETCH_PURPOSES_START:
    return state.merge({
      isFetchingPurposes: true,
    });

  case ActionTypes.FETCH_PURPOSES_SUCCESS:
    return state.merge({
      isFetchingPurposes: false,
      shouldFetchPurposes: false,
    });

  case ActionTypes.FETCH_RESOURCE_START:
    return state.merge({ 'isFetchingResource': true });

  case ActionTypes.FETCH_RESOURCE_SUCCESS:
    return state.merge({ isFetchingResource: false });

  case ActionTypes.FETCH_RESOURCES_START:
    return state.merge({ 'isFetchingSearchResults': true });

  case ActionTypes.FETCH_RESOURCES_SUCCESS:
    return state.merge({
      isFetchingSearchResults: false,
      shouldFetchSearchResults: false,
    });

  case ActionTypes.FETCH_UNITS_SUCCESS:
    return state.merge({
      shouldFetchUnits: false,
    });

  default:
    return state;
  }
}
