import { createSelector } from 'reselect';

const isFetchingSearchResultsSelector = (state) => state.api.isFetchingSearchResults;
const resourcesSelector = (state) => state.data.resources;
const searchResultsSelector = (state) => state.ui.search.results;
const unitsSelector = (state) => state.data.units;

export const searchPageSelectors = createSelector(
  isFetchingSearchResultsSelector,
  resourcesSelector,
  searchResultsSelector,
  unitsSelector,
  (isFetchingSearchResults, resources, searchResults, units) => {
    return {
      isFetchingSearchResults,
      results: searchResults.map(resourceId => resources[resourceId]),
      units,
    };
  }
);
