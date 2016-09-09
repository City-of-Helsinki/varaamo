import { createSelector } from 'reselect';

import ActionTypes from 'constants/ActionTypes';
import purposeOptionsSelector from 'selectors/purposeOptionsSelector';
import uiSearchFiltersSelector from 'selectors/uiSearchFiltersSelector';
import urlSearchFiltersSelector from 'selectors/urlSearchFiltersSelector';
import requestIsActiveSelectorFactory from 'selectors/factories/requestIsActiveSelectorFactory';

const searchControlsSelector = createSelector(
  purposeOptionsSelector,
  requestIsActiveSelectorFactory(ActionTypes.API.PURPOSES_GET_REQUEST),
  uiSearchFiltersSelector,
  urlSearchFiltersSelector,
  (
    purposeOptions,
    isFetchingPurposes,
    uiSearchFilters,
    urlSearchFilters
  ) => ({
    isFetchingPurposes,
    filters: uiSearchFilters,
    purposeOptions,
    urlSearchFilters,
  })
);

export default searchControlsSelector;
