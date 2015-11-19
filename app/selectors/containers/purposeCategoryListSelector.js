import { createSelector } from 'reselect';

import ActionTypes from 'constants/ActionTypes';
import groupedPurposesSelector from 'selectors/groupedPurposesSelector';
import purposeCategoriesSelector from 'selectors/purposeCategoriesSelector';
import requestIsActiveSelectorFactory from 'selectors/factories/requestIsActiveSelectorFactory';

const purposeCategoryListSelector = createSelector(
  groupedPurposesSelector,
  purposeCategoriesSelector,
  requestIsActiveSelectorFactory(ActionTypes.API.PURPOSES_GET_REQUEST),
  (
    groupedPurposes,
    purposeCategories,
    isFetchingPurposes
  ) => {
    return {
      isFetchingPurposes,
      groupedPurposes,
      purposeCategories,
    };
  }
);

export default purposeCategoryListSelector;
