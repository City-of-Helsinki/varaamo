import _ from 'lodash';
import { createSelector } from 'reselect';

import { getDateString } from 'utils/TimeUtils';

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
      filters: Object.assign({}, filters, { date: getDateString(filters.date) }),
      isFetchingSearchResults,
      results,
      units,
    };
  }
);
