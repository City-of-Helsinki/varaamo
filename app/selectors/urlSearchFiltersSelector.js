import { createSelector } from 'reselect';

import constants from 'constants/AppConstants';
import { getDateString } from 'utils/timeUtils';

const filtersSelector = (state, props) => props.location.query;

const urlSearchFiltersSelector = createSelector(
  filtersSelector,
  (filters) => {
    const urlSearchFilters = Object.assign(
      {},
      constants.SUPPORTED_SEARCH_FILTERS,
      filters,
      { date: getDateString(filters.date) }
    );

    return urlSearchFilters;
  }
);

export default urlSearchFiltersSelector;
