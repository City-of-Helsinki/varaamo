import Immutable from 'seamless-immutable';

import ActionTypes from 'constants/ActionTypes';

const initialState = Immutable({
  isFetchingSearchResults: false,
  shouldFetchSearchResults: true,
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

  default:
    return state;
  }
}
