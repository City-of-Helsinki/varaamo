import { createSelector } from 'reselect';

import { SUPPORTED_SEARCH_FILTERS } from 'constants/AppConstants';
import { getDateString } from 'utils/TimeUtils';

const filtersSelector = (state, props) => props.location.query;

const urlSearchFiltersSelector = createSelector(
  filtersSelector,
  (filters) => {
    const urlSearchFilters = Object.assign(
      {},
      SUPPORTED_SEARCH_FILTERS,
      filters,
      { date: getDateString(filters.date) }
    );

    return urlSearchFilters;
  }
);

export default urlSearchFiltersSelector;
