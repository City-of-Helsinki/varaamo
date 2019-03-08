import constants from 'constants/AppConstants';

import omit from 'lodash/omit';
import { createSelector } from 'reselect';

import { textBoolean } from 'utils/searchUtils';
import { getDateString } from 'utils/timeUtils';

const filtersSelector = state => state.ui.search.filters;

const uiSearchFiltersSelector = createSelector(
  filtersSelector,
  (filters) => {
    const uiSearchFilters = Object.assign(
      {},
      omit(constants.SUPPORTED_SEARCH_FILTERS, ['lat', 'lon']),
      filters,
      {
        duration: Number(filters.duration),
        freeOfCharge: textBoolean(filters.freeOfCharge) || '',
        date: getDateString(filters.date),
        page: parseInt(filters.page, 10) || 1,
        useTimeRange: textBoolean(filters.useTimeRange),
      }
    );

    return uiSearchFilters;
  }
);

export default uiSearchFiltersSelector;
