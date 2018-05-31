import sortBy from 'lodash/sortBy';
import values from 'lodash/values';
import { createSelector, createStructuredSelector } from 'reselect';

import ActionTypes from 'constants/ActionTypes';
import { purposesSelector, unitsSelector } from 'state/selectors/dataSelectors';
import uiSearchFiltersSelector from 'state/selectors/uiSearchFiltersSelector';
import urlSearchFiltersSelector from 'state/selectors/urlSearchFiltersSelector';
import requestIsActiveSelectorFactory from 'state/selectors/factories/requestIsActiveSelectorFactory';
import { currentLanguageSelector } from 'state/selectors/translationSelectors';

const positionSelector = state => state.ui.search.position;

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

const unitOptionsSelector = createSelector(
  unitsSelector,
  (units) => {
    const unitOptions = values(units)
      .map(unit => ({
        value: unit.id,
        label: unit.name,
      }));
    return sortBy(unitOptions, 'label');
  }
);

const searchControlsSelector = createStructuredSelector({
  currentLanguage: currentLanguageSelector,
  filters: uiSearchFiltersSelector,
  isFetchingPurposes: requestIsActiveSelectorFactory(ActionTypes.API.PURPOSES_GET_REQUEST),
  isFetchingUnits: requestIsActiveSelectorFactory(ActionTypes.API.UNITS_GET_REQUEST),
  position: positionSelector,
  purposeOptions: purposeOptionsSelector,
  unitOptions: unitOptionsSelector,
  urlSearchFilters: urlSearchFiltersSelector,
});

export default searchControlsSelector;
