import { createSelector } from 'reselect';

const categorySelector = (state) => state.search.category;
const resourcesSelector = (state) => state.resources;
const searchResultsSelector = (state) => state.search.searchResults;

export const searchPageSelectors = createSelector(
  categorySelector,
  searchResultsSelector,
  resourcesSelector,
  (category, searchResults, resources) => {
    return {
      category,
      isFetchingSearchResults: searchResults.isFetching,
      results: searchResults.ids.map(resourceId => resources[resourceId]),
    };
  }
);
