import { createSelector } from 'reselect';

import ActionTypes from 'constants/ActionTypes';
import purposeOptionsSelector from 'selectors/purposeOptionsSelector';
import uiSearchFiltersSelector from 'selectors/uiSearchFiltersSelector';
import urlSearchFiltersSelector from 'selectors/urlSearchFiltersSelector';
import typeaheadOptionsSelector from 'selectors/typeaheadOptionsSelector';
import requestIsActiveSelectorFactory from 'selectors/factories/requestIsActiveSelectorFactory';

const searchControlsSelector = createSelector(
  purposeOptionsSelector,
  requestIsActiveSelectorFactory(ActionTypes.API.PURPOSES_GET_REQUEST),
  typeaheadOptionsSelector,
  uiSearchFiltersSelector,
  urlSearchFiltersSelector,
  (
    purposeOptions,
    isFetchingPurposes,
    typeaheadOptions,
    uiSearchFilters,
    urlSearchFilters
  ) => {
    return {
      isFetchingPurposes,
      filters: uiSearchFilters,
      purposeOptions,
      typeaheadOptions,
      urlSearchFilters,
    };
  }
);

export default searchControlsSelector;
