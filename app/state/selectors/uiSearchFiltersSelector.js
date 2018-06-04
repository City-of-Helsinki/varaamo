import omit from 'lodash/omit';
import { createSelector } from 'reselect';

import constants from 'constants/AppConstants';
import { getDateString, getDuration, getEndTimeString, getStartTimeString } from 'utils/timeUtils';

const filtersSelector = state => state.ui.search.filters;

const uiSearchFiltersSelector = createSelector(
  filtersSelector,
  (filters) => {
    const uiSearchFilters = Object.assign(
      {},
      omit(constants.SUPPORTED_SEARCH_FILTERS, ['lat', 'lon']),
      filters,
      {
        charge: (filters.charge === 'true' || filters.charge === true),
        date: getDateString(filters.date),
        duration: getDuration(filters.duration),
        end: getEndTimeString(filters.end),
        page: parseInt(filters.page, 10) || 1,
        start: getStartTimeString(filters.start),
      },
    );

    return uiSearchFilters;
  }
);

export default uiSearchFiltersSelector;
