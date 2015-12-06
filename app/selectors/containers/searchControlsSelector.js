import { createSelector } from 'reselect';

import ActionTypes from 'constants/ActionTypes';
import purposeOptionsSelector from 'selectors/purposeOptionsSelector';
import urlSearchFiltersSelector from 'selectors/urlSearchFiltersSelector';
import typeaheadOptionsSelector from 'selectors/typeaheadOptionsSelector';
import requestIsActiveSelectorFactory from 'selectors/factories/requestIsActiveSelectorFactory';

const searchControlsSelector = createSelector(
  purposeOptionsSelector,
  requestIsActiveSelectorFactory(ActionTypes.API.PURPOSES_GET_REQUEST),
  typeaheadOptionsSelector,
  urlSearchFiltersSelector,
  (
    purposeOptions,
    isFetchingPurposes,
    typeaheadOptions,
    urlSearchFilters
  ) => {
    return {
      isFetchingPurposes,
      filters: urlSearchFilters,
      purposeOptions,
      typeaheadOptions,
    };
  }
);

export default searchControlsSelector;
