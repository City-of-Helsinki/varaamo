import _ from 'lodash';
import { createSelector } from 'reselect';

import types from 'constants/ActionTypes';
import purposeOptionsSelector from 'selectors/purposeOptionsSelector';
import searchFiltersSelector from 'selectors/searchFiltersSelector';

const activeRequestsSelector = (state) => state.api.activeRequests;

export const searchControlsSelectors = createSelector(
  activeRequestsSelector,
  purposeOptionsSelector,
  searchFiltersSelector,
  (
    activeRequests,
    purposeOptions,
    searchFilters
  ) => {
    const isFetchingPurposes = _.includes(activeRequests, types.API.PURPOSES_GET_REQUEST);

    return {
      isFetchingPurposes,
      filters: searchFilters,
      purposeOptions,
    };
  }
);
