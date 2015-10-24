import { createSelector } from 'reselect';

import ActionTypes from 'constants/ActionTypes';
import purposeOptionsSelector from 'selectors/purposeOptionsSelector';
import searchFiltersSelector from 'selectors/searchFiltersSelector';
import requestIsActiveSelectorFactory from 'selectors/factories/requestIsActiveSelectorFactory';

export const searchControlsSelectors = createSelector(
  purposeOptionsSelector,
  requestIsActiveSelectorFactory(ActionTypes.API.PURPOSES_GET_REQUEST),
  searchFiltersSelector,
  (
    purposeOptions,
    isFetchingPurposes,
    searchFilters
  ) => {
    return {
      isFetchingPurposes,
      filters: searchFilters,
      purposeOptions,
    };
  }
);
