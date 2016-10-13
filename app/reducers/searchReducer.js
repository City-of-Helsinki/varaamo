import values from 'lodash/values';
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

    default: {
      return state;
    }
  }
}

export default searchReducer;
