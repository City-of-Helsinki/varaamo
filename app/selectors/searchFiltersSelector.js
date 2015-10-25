import { createSelector } from 'reselect';

import { getDateString } from 'utils/TimeUtils';

const filtersSelector = (state) => state.ui.search.filters;

const searchFiltersSelector = createSelector(
  filtersSelector,
  (filters) => {
    const searchFilters = Object.assign({}, filters, { date: getDateString(filters.date) });

    return searchFilters;
  }
);

export default searchFiltersSelector;
