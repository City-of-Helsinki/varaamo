import { createSelector } from 'reselect';

const categorySelector = (state) => state.search.get('category');
const resourcesSelector = (state) => state.resources;
const searchResultsSelector = (state) => state.search.get('searchResults');

export const searchPageSelectors = createSelector(
  categorySelector,
  searchResultsSelector,
  resourcesSelector,
  (category, searchResults, resources) => {
    return {
      category,
      isFetchingSearchResults: searchResults.get('isFetching'),
      results: searchResults.get('ids').map((resourceId) => resources.get(resourceId)),
    };
  }
);
