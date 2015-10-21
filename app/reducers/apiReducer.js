import Immutable from 'seamless-immutable';

import types from 'constants/ActionTypes';

const initialState = Immutable({
  isFetchingSearchResults: false,
  isFetchingPurposes: false,
  isFetchingResource: false,
  pendingReservationsCount: 0,
  shouldFetchPurposes: true,
  shouldFetchSearchResults: true,
  shouldFetchUnits: true,
});

export function apiReducer(state = initialState, action) {
  switch (action.type) {

  case types.API.FETCH_PURPOSES_START:
    return state.merge({
      isFetchingPurposes: true,
    });

  case types.API.FETCH_PURPOSES_SUCCESS:
    return state.merge({
      isFetchingPurposes: false,
      shouldFetchPurposes: false,
    });

  case types.API.FETCH_RESOURCE_START:
    return state.merge({ 'isFetchingResource': true });

  case types.API.FETCH_RESOURCE_SUCCESS:
  case types.API.FETCH_RESOURCE_ERROR:
    return state.merge({ isFetchingResource: false });

  case types.API.FETCH_RESOURCES_START:
    return state.merge({ 'isFetchingSearchResults': true });

  case types.API.FETCH_RESOURCES_SUCCESS:
    return state.merge({
      isFetchingSearchResults: false,
      shouldFetchSearchResults: false,
    });

  case types.API.FETCH_UNITS_SUCCESS:
    return state.merge({
      shouldFetchUnits: false,
    });

  case types.API.MAKE_RESERVATION_START:
    return state.merge({ 'pendingReservationsCount': state.pendingReservationsCount + 1 });

  case types.API.MAKE_RESERVATION_SUCCESS:
  case types.API.MAKE_RESERVATION_ERROR:
    return state.merge({ 'pendingReservationsCount': state.pendingReservationsCount - 1 });

  case types.UI.CHANGE_SEARCH_FILTERS:
    return state.merge({
      shouldFetchSearchResults: true,
    });

  default:
    return state;
  }
}
