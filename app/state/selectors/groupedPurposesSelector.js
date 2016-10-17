import filter from 'lodash/filter';
import groupBy from 'lodash/groupBy';
import { createSelector } from 'reselect';

const purposesSelector = state => state.data.purposes;

const groupedPurposesSelector = createSelector(
  purposesSelector,
  (purposes) => {
    const purposeCategories = groupBy(
      filter(purposes, purpose => purpose.parent !== null),
      'parent'
    );

    return purposeCategories;
  }
);

export default groupedPurposesSelector;
