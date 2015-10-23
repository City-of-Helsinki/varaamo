import _ from 'lodash';
import { createSelector } from 'reselect';

import types from 'constants/ActionTypes';

const activeRequestsSelector = (state) => state.api.activeRequests;
const purposesSelector = (state) => state.data.purposes;

export const purposeCategoryListSelectors = createSelector(
  activeRequestsSelector,
  purposesSelector,
  (
    activeRequests,
    purposes
  ) => {
    const isFetchingPurposes = _.includes(activeRequests, types.API.PURPOSES_GET_REQUEST);
    const purposeCategories = _.groupBy(purposes, 'mainType');

    return {
      isFetchingPurposes,
      purposeCategories,
    };
  }
);
