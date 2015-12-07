import _ from 'lodash';
import queryString from 'query-string';

import { SUPPORTED_SEARCH_FILTERS } from 'constants/AppConstants';
import { getDateStartAndEndTimes, getDateString } from 'utils/TimeUtils';

export default {
  getFetchParamsFromFilters,
  getSearchPageUrl,
  pickSupportedFilters,
};

function getFetchParamsFromFilters(filters) {
  const all = Object.assign(
    {},
    pickSupportedFilters(filters),
    getDateStartAndEndTimes(filters.date)
  );

  return _.omit(all, 'date');
}

function getSearchPageUrl(filters = {}) {
  const query = queryString.stringify(
    Object.assign(
      {},
      filters,
      { date: getDateString(filters.date) }
    )
  );

  return `/search?${query}`;
}

function pickSupportedFilters(filters) {
  return _.pick(filters, _.keys(SUPPORTED_SEARCH_FILTERS));
}
