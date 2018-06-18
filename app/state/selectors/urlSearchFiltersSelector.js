import omit from 'lodash/omit';
import { createSelector } from 'reselect';

import constants from 'constants/AppConstants';
import { getDateString } from 'utils/timeUtils';

const filtersSelector = (state, props) => props.location.query;

const urlSearchFiltersSelector = createSelector(
  filtersSelector,
  (filters) => {
    const urlSearchFilters = Object.assign(
      {},
      omit(constants.SUPPORTED_SEARCH_FILTERS, ['lat', 'lon']),
      filters,
      {
        charge: (filters.charge === 'true' || filters.charge === true),
        date: getDateString(filters.date),
        page: parseInt(filters.page, 10) || 1,
      },
    );
    return urlSearchFilters;
  }
);

export default urlSearchFiltersSelector;
