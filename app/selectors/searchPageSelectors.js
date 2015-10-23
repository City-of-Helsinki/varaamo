import _ from 'lodash';
import { createSelector } from 'reselect';

import types from 'constants/ActionTypes';
import searchFiltersSelector from 'selectors/searchFiltersSelector';

const activeRequestsSelector = (state) => state.api.activeRequests;
const resourcesSelector = (state) => state.data.resources;
const searchResultsSelector = (state) => state.ui.search.results;
const unitsSelector = (state) => state.data.units;

export const searchPageSelectors = createSelector(
  activeRequestsSelector,
  resourcesSelector,
  searchFiltersSelector,
  searchResultsSelector,
  unitsSelector,
  (
    activeRequests,
    resources,
    searchFilters,
    searchResults,
    units
  ) => {
    const isFetchingSearchResults = _.includes(activeRequests, types.API.RESOURCES_GET_REQUEST);
    const results = _.sortBy(
      searchResults.map(resourceId => resources[resourceId]),
      (result) => result.name.fi
    );

    return {
      filters: searchFilters,
      isFetchingSearchResults,
      results,
      units,
    };
  }
);
