import { createSelector } from 'reselect';

import constants from 'constants/AppConstants';
import { getDateString } from 'utils/timeUtils';

const filtersSelector = state => state.ui.search.filters;

const uiSearchFiltersSelector = createSelector(
  filtersSelector,
  (filters) => {
    const uiSearchFilters = Object.assign(
      {},
      constants.SUPPORTED_SEARCH_FILTERS,
      filters,
      { date: getDateString(filters.date) }
    );

    return uiSearchFilters;
  }
);

export default uiSearchFiltersSelector;
