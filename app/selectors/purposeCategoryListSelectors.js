import _ from 'lodash';
import { createSelector } from 'reselect';

const isFetchingPurposesSelector = (state) => state.api.isFetchingPurposes;
const purposesSelector = (state) => state.data.purposes;

export const purposeCategoryListSelectors = createSelector(
  isFetchingPurposesSelector,
  purposesSelector,
  (
    isFetchingPurposes,
    purposes
  ) => {
    const purposeCategories = _.groupBy(purposes, 'mainType');

    return {
      isFetchingPurposes,
      purposeCategories,
    };
  }
);
