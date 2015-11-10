import { createSelector } from 'reselect';

import ActionTypes from 'constants/ActionTypes';
import searchFiltersSelector from 'selectors/searchFiltersSelector';
import searchResultsSelector from 'selectors/searchResultsSelector';
import requestIsActiveSelectorFactory from 'selectors/factories/requestIsActiveSelectorFactory';

const searchDoneSelector = (state) => state.ui.search.searchDone;
const unitsSelector = (state) => state.data.units;

const searchPageSelector = createSelector(
  requestIsActiveSelectorFactory(ActionTypes.API.SEARCH_RESULTS_GET_REQUEST),
  searchDoneSelector,
  searchFiltersSelector,
  searchResultsSelector,
  unitsSelector,
  (
    isFetchingSearchResults,
    searchDone,
    searchFilters,
    searchResults,
    units
  ) => {
    return {
      filters: searchFilters,
      isFetchingSearchResults,
      results: searchResults,
      searchDone,
      units,
    };
  }
);

export default searchPageSelector;
