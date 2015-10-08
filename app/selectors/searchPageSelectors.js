import { createSelector } from 'reselect';

const isFetchingSearchResultsSelector = (state) => state.api.isFetchingSearchResults;
const purposeFilterSelector = (state) => state.ui.search.purposeFilter;
const resourcesSelector = (state) => state.data.resources;
const searchResultsSelector = (state) => state.ui.search.results;
const unitsSelector = (state) => state.data.units;

export const searchPageSelectors = createSelector(
  isFetchingSearchResultsSelector,
  purposeFilterSelector,
  resourcesSelector,
  searchResultsSelector,
  unitsSelector,
  (isFetchingSearchResults, purposeFilter, resources, searchResults, units) => {
    return {
      isFetchingSearchResults,
      purposeFilter,
      results: searchResults.map(resourceId => resources[resourceId]),
      units,
    };
  }
);
