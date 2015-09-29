import _ from 'lodash';
import {List, Map} from 'immutable';

import ActionTypes from 'constants/ActionTypes';

const initialState = Map({
  category: 'all',
  searchResults: Map({
    ids: List(),
    isFetching: false,
    shouldFetch: true,
  }),
});

function searchResults(state, action) {
  switch (action.type) {

  case ActionTypes.FETCH_RESOURCES_START:
    return state.set('isFetching', true);

  case ActionTypes.FETCH_RESOURCES_SUCCESS:
    const resources = _.values(action.payload);
    return state.merge({
      ids: List(_.pluck(resources, 'id')),
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
    return state.set('searchResults', searchResults(state.get('searchResults'), action));

  default:
    return state;
  }
}
