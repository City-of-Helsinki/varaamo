import { createSelector } from 'reselect';

import { SUPPORTED_SEARCH_FILTERS } from 'constants/AppConstants';
import { getDateString } from 'utils/TimeUtils';

const filtersSelector = (state) => state.ui.search.filters;

const uiSearchFiltersSelector = createSelector(
  filtersSelector,
  (filters) => {
    const uiSearchFilters = Object.assign(
      {},
      SUPPORTED_SEARCH_FILTERS,
      filters,
      { date: getDateString(filters.date) }
    );

    return uiSearchFilters;
  }
);

export default uiSearchFiltersSelector;
