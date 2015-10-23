import _ from 'lodash';
import { createSelector } from 'reselect';

const purposesSelector = (state) => state.data.purposes;

export const purposeCategoriesSelector = createSelector(
  purposesSelector,
  (purposes) => {
    const purposeCategories = _.groupBy(purposes, 'mainType');

    return purposeCategories;
  }
);

export default purposeCategoriesSelector;
