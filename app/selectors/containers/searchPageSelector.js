import { createSelector } from 'reselect';

import ActionTypes from 'constants/ActionTypes';
import urlSearchFiltersSelector from 'selectors/urlSearchFiltersSelector';
import searchResultsSelector from 'selectors/searchResultsSelector';
import requestIsActiveSelectorFactory from 'selectors/factories/requestIsActiveSelectorFactory';

const searchDoneSelector = (state) => state.ui.search.searchDone;
const unitsSelector = (state) => state.data.units;

const searchPageSelector = createSelector(
  requestIsActiveSelectorFactory(ActionTypes.API.SEARCH_RESULTS_GET_REQUEST),
  searchDoneSelector,
  searchResultsSelector,
  unitsSelector,
  urlSearchFiltersSelector,
  (
    isFetchingSearchResults,
    searchDone,
    searchResults,
    units,
    urlSearchFilters
  ) => {
    return {
      filters: urlSearchFilters,
      isFetchingSearchResults,
      results: searchResults,
      searchDone,
      units,
    };
  }
);

export default searchPageSelector;
