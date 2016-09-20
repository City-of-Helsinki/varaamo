import values from 'lodash/values';
import queryString from 'query-string';
import { UPDATE_PATH } from 'redux-simple-router';
import Immutable from 'seamless-immutable';

import types from 'constants/ActionTypes';
import { pickSupportedFilters } from 'utils/searchUtils';

const initialState = Immutable({
  filters: {
    date: '',
    people: '',
    purpose: '',
    search: '',
  },
  results: [],
  searchDone: false,
  typeaheadSuggestions: [],
});

function searchReducer(state = initialState, action) {
  switch (action.type) {

    case types.API.SEARCH_RESULTS_GET_SUCCESS: {
      const results = Object.keys(action.payload.entities.resources || {});
      return state.merge({
        results,
        searchDone: true,
      });
    }

    case types.API.TYPEAHEAD_SUGGESTIONS_GET_SUCCESS: {
      const typeaheadSuggestions = values(action.payload.resource);
      return state.merge({ typeaheadSuggestions });
    }

    case types.UI.CHANGE_SEARCH_FILTERS: {
      const filters = pickSupportedFilters(action.payload);
      return state.merge({ filters }, { deep: true });
    }

    case types.UI.CLEAR_SEARCH_RESULTS: {
      return initialState;
    }

    case UPDATE_PATH: {
      const query = queryString.extract(action.path);
      const urlSearchFilters = pickSupportedFilters(queryString.parse(query));
      return state.merge({ filters: urlSearchFilters }, { deep: true });
    }

    default: {
      return state;
    }
  }
}

export default searchReducer;
