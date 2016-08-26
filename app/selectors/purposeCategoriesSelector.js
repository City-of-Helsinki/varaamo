import pickBy from 'lodash/pickBy';
import { createSelector } from 'reselect';

const purposesSelector = (state) => state.data.purposes;

export const purposeCategoriesSelector = createSelector(
  purposesSelector,
  (purposes) => {
    return pickBy(purposes, (purpose) => purpose.parent === null);
  }
);

export default purposeCategoriesSelector;
