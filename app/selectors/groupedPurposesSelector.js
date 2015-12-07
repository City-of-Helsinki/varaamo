import filter from 'lodash/collection/filter';
import groupBy from 'lodash/collection/groupBy';
import { createSelector } from 'reselect';

const purposesSelector = (state) => state.data.purposes;

export const groupedPurposesSelector = createSelector(
  purposesSelector,
  (purposes) => {
    const purposeCategories = groupBy(
      filter(purposes, (purpose) => purpose.parent !== null),
      'parent'
    );

    return purposeCategories;
  }
);

export default groupedPurposesSelector;
