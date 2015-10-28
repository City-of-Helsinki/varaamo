import _ from 'lodash';

import { SUPPORTED_SEARCH_FILTERS } from 'constants/AppConstants';
import { getDateStartAndEndTimes } from 'utils/TimeUtils';

export default {
  getFetchParamsFromFilters,
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

function pickSupportedFilters(filters) {
  return _.pick(filters, _.keys(SUPPORTED_SEARCH_FILTERS));
}
