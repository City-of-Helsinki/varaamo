import _ from 'lodash';
import { createSelector } from 'reselect';

const isFetchingPurposesSelector = (state) => state.api.isFetchingPurposes;
const purposesSelector = (state) => state.data.purposes;

export const homePageSelectors = createSelector(
  isFetchingPurposesSelector,
  purposesSelector,
  (isFetchingPurposes, purposes) => {
    return {
      isFetchingPurposes,
      purposeCategories: _.groupBy(purposes, 'mainType'),
    };
  }
);
