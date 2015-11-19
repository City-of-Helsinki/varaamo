import _ from 'lodash';
import { createSelector } from 'reselect';

const purposesSelector = (state) => state.data.purposes;

export const groupedPurposesSelector = createSelector(
  purposesSelector,
  (purposes) => {
    const purposeCategories = _.groupBy(
      _.filter(purposes, (purpose) => purpose.parent !== null),
      'parent'
    );

    return purposeCategories;
  }
);

export default groupedPurposesSelector;
