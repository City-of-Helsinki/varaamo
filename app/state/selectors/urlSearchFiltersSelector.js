import constants from 'constants/AppConstants';

import omit from 'lodash/omit';
import { createSelector } from 'reselect';
import queryString from 'query-string';

import { textBoolean } from 'utils/searchUtils';
import { getDateString } from 'utils/timeUtils';

const filtersSelector = (state, props) => queryString.parse(props.location.search);

const urlSearchFiltersSelector = createSelector(
  filtersSelector,
  (filters) => {
    const urlSearchFilters = Object.assign(
      {},
      omit(constants.SUPPORTED_SEARCH_FILTERS, ['lat', 'lon']),
      filters,
      {
        freeOfCharge: textBoolean(filters.freeOfCharge) || '',
        date: getDateString(filters.date),
        page: parseInt(filters.page, 10) || 1,
        useTimeRange: textBoolean(filters.useTimeRange),
      }
    );
    return urlSearchFilters;
  }
);

export default urlSearchFiltersSelector;
