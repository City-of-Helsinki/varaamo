import Immutable from 'seamless-immutable';

import types from 'constants/ActionTypes';

const initialState = Immutable({
  purposes: true,
  resources: true,
  searchResults: true,
  units: true,
});

function shouldFetchReducer(state = initialState, action) {
  switch (action.type) {

  case types.API.PURPOSES_GET_SUCCESS:
    return state.merge({
      purposes: false,
    });

  case types.API.RESOURCES_GET_SUCCESS:
    return state.merge({
      resources: false,
    });

  case types.API.SEARCH_RESULTS_GET_SUCCESS:
    return state.merge({
      searchResults: false,
    });

  case types.API.UNITS_GET_SUCCESS:
    return state.merge({
      units: false,
    });

  case types.UI.CHANGE_SEARCH_FILTERS:
    return state.merge({
      searchResults: true,
    });

  default:
    return state;
  }
}

export default shouldFetchReducer;
