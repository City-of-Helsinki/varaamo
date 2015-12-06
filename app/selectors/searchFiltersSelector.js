import { createSelector } from 'reselect';

import { SUPPORTED_SEARCH_FILTERS } from 'constants/AppConstants';
import { getDateString } from 'utils/TimeUtils';

const filtersSelector = (state, props) => props.location.query;

const searchFiltersSelector = createSelector(
  filtersSelector,
  (filters) => {
    const searchFilters = Object.assign(
      {},
      SUPPORTED_SEARCH_FILTERS,
      filters,
      { date: getDateString(filters.date) }
    );

    return searchFilters;
  }
);

export default searchFiltersSelector;
