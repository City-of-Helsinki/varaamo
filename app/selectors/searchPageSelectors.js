import _ from 'lodash';
import { createSelector } from 'reselect';

const filtersSelector = (state) => state.ui.search.filters;
const isFetchingSearchResultsSelector = (state) => state.api.isFetchingSearchResults;
const resourcesSelector = (state) => state.data.resources;
const searchResultsSelector = (state) => state.ui.search.results;
const unitsSelector = (state) => state.data.units;

export const searchPageSelectors = createSelector(
  filtersSelector,
  isFetchingSearchResultsSelector,
  resourcesSelector,
  searchResultsSelector,
  unitsSelector,
  (
    filters,
    isFetchingSearchResults,
    resources,
    searchResults,
    units
  ) => {
    const results = _.sortBy(
      searchResults.map(resourceId => resources[resourceId]),
      (result) => result.name.fi
    );

    return {
      filters,
      isFetchingSearchResults,
      results,
      units,
    };
  }
);
