import Immutable from 'seamless-immutable';

import ActionTypes from 'constants/ActionTypes';

const initialState = Immutable({
  isFetchingSearchResults: false,
  shouldFetchSearchResults: true,
  shouldFetchUnits: true,
});

export function apiReducer(state = initialState, action) {
  switch (action.type) {

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
