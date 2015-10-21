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

  case types.API.PURPOSES_GET_REQUEST:
    return state.merge({
      isFetchingPurposes: true,
    });

  case types.API.PURPOSES_GET_SUCCESS:
    return state.merge({
      isFetchingPurposes: false,
      shouldFetchPurposes: false,
    });

  case types.API.RESOURCE_GET_REQUEST:
    return state.merge({ 'isFetchingResource': true });

  case types.API.RESOURCE_GET_SUCCESS:
  case types.API.RESOURCE_GET_ERROR:
    return state.merge({ isFetchingResource: false });

  case types.API.RESOURCES_GET_REQUEST:
    return state.merge({ 'isFetchingSearchResults': true });

  case types.API.RESOURCES_GET_SUCCESS:
    return state.merge({
      isFetchingSearchResults: false,
      shouldFetchSearchResults: false,
    });

  case types.API.UNITS_GET_SUCCESS:
    return state.merge({
      shouldFetchUnits: false,
    });

  case types.API.RESERVATION_POST_REQUEST:
    return state.merge({ 'pendingReservationsCount': state.pendingReservationsCount + 1 });

  case types.API.RESERVATION_POST_SUCCESS:
  case types.API.RESERVATION_POST_ERROR:
    return state.merge({ 'pendingReservationsCount': state.pendingReservationsCount - 1 });

  case types.UI.CHANGE_SEARCH_FILTERS:
    return state.merge({
      shouldFetchSearchResults: true,
    });

  default:
    return state;
  }
}
