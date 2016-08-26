import filter from 'lodash/filter';
import sortBy from 'lodash/sortBy';
import values from 'lodash/values';
import { createSelector } from 'reselect';
import Immutable from 'seamless-immutable';

import { getName } from 'utils/DataUtils';

const purposesSelector = (state) => state.data.purposes;

const purposeOptionsSelector = createSelector(
  purposesSelector,
  (purposes) => {
    const purposeOptions = filter(
      values(purposes), (purpose) => purpose.parent !== null
    ).map(purpose => {
      return {
        value: purpose.id,
        label: getName(purpose),
      };
    });
    const alphabetized = sortBy(purposeOptions, 'label');

    return Immutable(alphabetized);
  }
);

export default purposeOptionsSelector;
