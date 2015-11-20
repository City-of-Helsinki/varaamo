import { createSelector } from 'reselect';

import ActionTypes from 'constants/ActionTypes';
import purposeOptionsSelector from 'selectors/purposeOptionsSelector';
import searchFiltersSelector from 'selectors/searchFiltersSelector';
import typeaheadOptionsSelector from 'selectors/typeaheadOptionsSelector';
import requestIsActiveSelectorFactory from 'selectors/factories/requestIsActiveSelectorFactory';

const searchControlsSelector = createSelector(
  purposeOptionsSelector,
  requestIsActiveSelectorFactory(ActionTypes.API.PURPOSES_GET_REQUEST),
  searchFiltersSelector,
  typeaheadOptionsSelector,
  (
    purposeOptions,
    isFetchingPurposes,
    searchFilters,
    typeaheadOptions
  ) => {
    return {
      isFetchingPurposes,
      filters: searchFilters,
      purposeOptions,
      typeaheadOptions,
    };
  }
);

export default searchControlsSelector;
