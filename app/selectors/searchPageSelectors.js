import _ from 'lodash';
import { createSelector } from 'reselect';

import types from 'constants/ActionTypes';
import { getDateString } from 'utils/TimeUtils';

const activeRequestsSelector = (state) => state.api.activeRequests;
const filtersSelector = (state) => state.ui.search.filters;
const resourcesSelector = (state) => state.data.resources;
const searchResultsSelector = (state) => state.ui.search.results;
const unitsSelector = (state) => state.data.units;

export const searchPageSelectors = createSelector(
  activeRequestsSelector,
  filtersSelector,
  resourcesSelector,
  searchResultsSelector,
  unitsSelector,
  (
    activeRequests,
    filters,
    resources,
    searchResults,
    units
  ) => {
    const isFetchingSearchResults = _.includes(activeRequests, types.API.RESOURCES_GET_REQUEST);
    const results = _.sortBy(
      searchResults.map(resourceId => resources[resourceId]),
      (result) => result.name.fi
    );

    return {
      filters: Object.assign({}, filters, { date: getDateString(filters.date) }),
      isFetchingSearchResults,
      results,
      units,
    };
  }
);
