import pick from 'lodash/object/pick';
import { createSelector } from 'reselect';

const purposesSelector = (state) => state.data.purposes;

export const purposeCategoriesSelector = createSelector(
  purposesSelector,
  (purposes) => {
    return pick(purposes, (purpose) => purpose.parent === null);
  }
);

export default purposeCategoriesSelector;
