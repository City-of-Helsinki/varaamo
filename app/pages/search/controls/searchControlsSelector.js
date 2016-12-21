import sortBy from 'lodash/sortBy';
import values from 'lodash/values';
import { createSelector, createStructuredSelector } from 'reselect';

import ActionTypes from 'constants/ActionTypes';
import { purposesSelector } from 'state/selectors/dataSelectors';
import uiSearchFiltersSelector from 'state/selectors/uiSearchFiltersSelector';
import urlSearchFiltersSelector from 'state/selectors/urlSearchFiltersSelector';
import requestIsActiveSelectorFactory from 'state/selectors/factories/requestIsActiveSelectorFactory';

const purposeOptionsSelector = createSelector(
  purposesSelector,
  (purposes) => {
    const purposeOptions = values(purposes)
      .filter(purpose => purpose.parent === null)
      .map(purpose => ({
        value: purpose.id,
        label: purpose.name,
      }));
    return sortBy(purposeOptions, 'label');
  }
);

const searchControlsSelector = createStructuredSelector({
  isFetchingPurposes: requestIsActiveSelectorFactory(ActionTypes.API.PURPOSES_GET_REQUEST),
  filters: uiSearchFiltersSelector,
  purposeOptions: purposeOptionsSelector,
  urlSearchFilters: urlSearchFiltersSelector,
});

export default searchControlsSelector;
