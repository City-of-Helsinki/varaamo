import _ from 'lodash';

import types from 'constants/ActionTypes';
import { pickSupportedFilters } from 'utils/SearchUtils';

export function searchReducer(state, action) {
  switch (action.type) {

  case types.API.FETCH_RESOURCES_SUCCESS:
    const results = _.keys(action.payload.entities.resources);
    return state.merge({ results });

  case types.UI.CHANGE_SEARCH_FILTERS:
    const filters = pickSupportedFilters(action.payload);
    return state.merge({ filters }, { deep: true });

  default:
    return state;
  }
}
