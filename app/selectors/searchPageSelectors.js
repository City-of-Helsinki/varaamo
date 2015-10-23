import _ from 'lodash';
import { createSelector } from 'reselect';

import types from 'constants/ActionTypes';
import searchFiltersSelector from 'selectors/searchFiltersSelector';
import searchResultsSelector from 'selectors/searchResultsSelector';

const activeRequestsSelector = (state) => state.api.activeRequests;
const unitsSelector = (state) => state.data.units;

export const searchPageSelectors = createSelector(
  activeRequestsSelector,
  searchFiltersSelector,
  searchResultsSelector,
  unitsSelector,
  (
    activeRequests,
    searchFilters,
    searchResults,
    units
  ) => {
    const isFetchingSearchResults = _.includes(activeRequests, types.API.RESOURCES_GET_REQUEST);

    return {
      filters: searchFilters,
      isFetchingSearchResults,
      results: searchResults,
      units,
    };
  }
);
