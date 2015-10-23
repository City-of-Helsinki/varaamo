import _ from 'lodash';
import { createSelector } from 'reselect';

import types from 'constants/ActionTypes';
import purposeCategoriesSelector from 'selectors/purposeCategoriesSelector';

const activeRequestsSelector = (state) => state.api.activeRequests;

export const purposeCategoryListSelectors = createSelector(
  activeRequestsSelector,
  purposeCategoriesSelector,
  (
    activeRequests,
    purposeCategories
  ) => {
    const isFetchingPurposes = _.includes(activeRequests, types.API.PURPOSES_GET_REQUEST);

    return {
      isFetchingPurposes,
      purposeCategories,
    };
  }
);
