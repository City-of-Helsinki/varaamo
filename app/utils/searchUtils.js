import constants from 'constants/AppConstants';

import omit from 'lodash/omit';
import pick from 'lodash/pick';
import queryString from 'query-string';
import { getDateStartAndEndTimes, getDateString } from 'utils/timeUtils';

function getFetchParamsFromFilters(filters) {
  const all = Object.assign(
    {},
    pickSupportedFilters(filters),
    getDateStartAndEndTimes(
      filters.date,
      filters.useTimeRange,
      filters.start,
      filters.end,
      filters.duration,
    ),
    { purpose: filters.purpose === 'all' ? '' : filters.purpose },
    { page: filters.page || 1 },
  );

  return omit(all, 'date', 'duration', 'useTimeRange');
}

function getSearchPageUrl(filters = {}) {
  const query = queryString.stringify(
    Object.assign({}, filters, { date: getDateString(filters.date) }),
  );

  return `/search?${query}`;
}

function pickSupportedFilters(filters) {
  return pick(filters, Object.keys(constants.SUPPORTED_SEARCH_FILTERS));
}

function textBoolean(value) {
  return value === 'true' || value === true;
}

export {
  getFetchParamsFromFilters, getSearchPageUrl, pickSupportedFilters, textBoolean
};
