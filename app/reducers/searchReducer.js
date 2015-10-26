import _ from 'lodash';
import Immutable from 'seamless-immutable';

import types from 'constants/ActionTypes';
import { pickSupportedFilters } from 'utils/SearchUtils';

const initialState = Immutable({
  filters: {
    date: '',
    purpose: '',
    search: '',
  },
  results: [],
});

function searchReducer(state = initialState, action) {
  switch (action.type) {

  case types.API.SEARCH_RESULTS_GET_SUCCESS:
    const results = _.keys(action.payload.entities.resources);
    return state.merge({ results });

  case types.UI.CHANGE_SEARCH_FILTERS:
    const filters = pickSupportedFilters(action.payload);
    return state.merge({ filters }, { deep: true });

  default:
    return state;
  }
}

export default searchReducer;
