import { createSelector } from 'reselect';

import ActionTypes from 'constants/ActionTypes';
import urlSearchFiltersSelector from 'selectors/urlSearchFiltersSelector';
import searchResultsSelector from 'selectors/searchResultsSelector';
import requestIsActiveSelectorFactory from 'selectors/factories/requestIsActiveSelectorFactory';

const searchDoneSelector = (state) => state.ui.search.searchDone;
const unitsSelector = (state) => state.data.units;
const urlSelector = (state) => state.routing.path;

const searchPageSelector = createSelector(
  requestIsActiveSelectorFactory(ActionTypes.API.SEARCH_RESULTS_GET_REQUEST),
  searchDoneSelector,
  searchResultsSelector,
  unitsSelector,
  urlSearchFiltersSelector,
  urlSelector,
  (
    isFetchingSearchResults,
    searchDone,
    searchResults,
    units,
    urlSearchFilters,
    url
  ) => {
    return {
      filters: urlSearchFilters,
      isFetchingSearchResults,
      results: searchResults,
      searchDone,
      units,
      url,
    };
  }
);

export default searchPageSelector;
