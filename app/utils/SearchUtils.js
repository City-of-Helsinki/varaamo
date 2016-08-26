import omit from 'lodash/omit';
import pick from 'lodash/pick';
import queryString from 'query-string';

import constants from 'constants/AppConstants';
import { getDateStartAndEndTimes, getDateString } from 'utils/TimeUtils';

function getFetchParamsFromFilters(filters) {
  const all = Object.assign(
    {},
    pickSupportedFilters(filters),
    getDateStartAndEndTimes(filters.date)
  );

  return omit(all, 'date');
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
  return pick(filters, Object.keys(constants.SUPPORTED_SEARCH_FILTERS));
}

export {
  getFetchParamsFromFilters,
  getSearchPageUrl,
  pickSupportedFilters,
};
