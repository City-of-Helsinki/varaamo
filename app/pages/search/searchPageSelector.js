import { createSelector } from 'reselect';

import ActionTypes from 'constants/ActionTypes';
import urlSearchFiltersSelector from 'state/selectors/urlSearchFiltersSelector';
import requestIsActiveSelectorFactory from 'state/selectors/factories/requestIsActiveSelectorFactory';

const searchDoneSelector = state => state.ui.search.searchDone;
const searchResultIdsSelector = state => state.ui.search.results;

const searchPageSelector = createSelector(
  requestIsActiveSelectorFactory(ActionTypes.API.SEARCH_RESULTS_GET_REQUEST),
  searchDoneSelector,
  searchResultIdsSelector,
  urlSearchFiltersSelector,
  (
    isFetchingSearchResults,
    searchDone,
    searchResultIds,
    urlSearchFilters
  ) => ({
    filters: urlSearchFilters,
    isFetchingSearchResults,
    searchDone,
    searchResultIds,
  })
);

export default searchPageSelector;
