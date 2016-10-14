import { createSelector } from 'reselect';

import ActionTypes from 'constants/ActionTypes';
import purposeOptionsSelector from 'state/selectors/purposeOptionsSelector';
import uiSearchFiltersSelector from 'state/selectors/uiSearchFiltersSelector';
import urlSearchFiltersSelector from 'state/selectors/urlSearchFiltersSelector';
import requestIsActiveSelectorFactory from 'state/selectors/factories/requestIsActiveSelectorFactory';

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
