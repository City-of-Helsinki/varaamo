import _ from 'lodash';

import { SUPPORTED_SEARCH_FILTERS } from 'constants/AppConstants';

export default {
  pickSupportedFilters,
};

function pickSupportedFilters(filters) {
  return _.pick(filters, SUPPORTED_SEARCH_FILTERS);
}
