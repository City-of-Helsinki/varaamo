import { createSelector } from 'reselect';

const categorySelector = (state) => state.ui.search.category;
const isFetchingSearchResultsSelector = (state) => state.api.isFetchingSearchResults;
const resourcesSelector = (state) => state.data.resources;
const searchResultsSelector = (state) => state.ui.search.results;

export const searchPageSelectors = createSelector(
  categorySelector,
  isFetchingSearchResultsSelector,
  resourcesSelector,
  searchResultsSelector,
  (category, isFetchingSearchResults, resources, searchResults) => {
    return {
      category,
      isFetchingSearchResults,
      results: searchResults.map(resourceId => resources[resourceId]),
    };
  }
);
