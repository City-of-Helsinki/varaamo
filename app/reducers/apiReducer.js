import _ from 'lodash';
import Immutable from 'seamless-immutable';

import types from 'constants/ActionTypes';

const initialState = Immutable({
  activeRequests: [],
  pendingReservationsCount: 0,
  shouldFetchPurposes: true,
  shouldFetchSearchResults: true,
  shouldFetchUnits: true,
});

export function apiReducer(state = initialState, action) {
  if (action.meta && action.meta.API_ACTION) {
    const { apiRequestStart, apiRequestFinish, type } = action.meta.API_ACTION;
    if (apiRequestStart) {
      return state.merge({ activeRequests: [...state.activeRequests, type] });
    }

    if (apiRequestFinish) {
      return state.merge({ activeRequests: _.without(state.activeRequests, type) });
    }
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
