import _ from 'lodash';
import { createSelector } from 'reselect';

const purposesSelector = (state) => state.data.purposes;

export const purposeCategoriesSelector = createSelector(
  purposesSelector,
  (purposes) => {
    return _.pick(purposes, (purpose) => purpose.parent === null);
  }
);

export default purposeCategoriesSelector;
