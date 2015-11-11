import _ from 'lodash';
import Immutable from 'seamless-immutable';

import types from 'constants/ActionTypes';

const initialState = Immutable({
  results: [],
  searchDone: false,
});

function searchReducer(state = initialState, action) {
  switch (action.type) {

  case types.API.SEARCH_RESULTS_GET_SUCCESS:
    const results = _.keys(action.payload.entities.resources);
    return state.merge({
      results,
      searchDone: true,
    });

  case types.UI.CLEAR_SEARCH_RESULTS:
    return initialState;

  default:
    return state;
  }
}

export default searchReducer;
