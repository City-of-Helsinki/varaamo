import { createSelector } from 'reselect';

const categorySelector = (state) => state.ui.search.category;
const isFetchingSearchResultsSelector = (state) => state.api.isFetchingSearchResults;
const resourcesSelector = (state) => state.data.resources;
const searchResultsSelector = (state) => state.ui.search.results;
const unitsSelector = (state) => state.data.units;

export const searchPageSelectors = createSelector(
  categorySelector,
  isFetchingSearchResultsSelector,
  resourcesSelector,
  searchResultsSelector,
  unitsSelector,
  (category, isFetchingSearchResults, resources, searchResults, units) => {
    return {
      category,
      isFetchingSearchResults,
      results: searchResults.map(resourceId => resources[resourceId]),
      units,
    };
  }
);
