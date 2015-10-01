import _ from 'lodash';
import Immutable from 'seamless-immutable';

import ActionTypes from 'constants/ActionTypes';

const initialState = Immutable({
  category: 'all',
  searchResults: {
    ids: [],
    isFetching: false,
    shouldFetch: true,
  },
});

function searchResultsReducer(state, action) {
  switch (action.type) {

  case ActionTypes.FETCH_RESOURCES_START:
    return state.merge({ 'isFetching': true });

  case ActionTypes.FETCH_RESOURCES_SUCCESS:
    const resources = _.values(action.payload);
    return state.merge({
      ids: _.pluck(resources, 'id'),
      isFetching: false,
      shouldFetch: false,
    });

  default:
    return state;
  }
}

export function searchReducer(state = initialState, action) {
  switch (action.type) {

  case ActionTypes.FETCH_RESOURCES_START:
  case ActionTypes.FETCH_RESOURCES_SUCCESS:
    const searchResults = searchResultsReducer(state.searchResults, action);
    return state.merge({ searchResults });

  default:
    return state;
  }
}
