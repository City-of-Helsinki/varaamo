import sortBy from 'lodash/sortBy';
import values from 'lodash/values';
import { createSelector } from 'reselect';
import Immutable from 'seamless-immutable';

import { getName } from 'utils/translationUtils';

const purposesSelector = state => state.data.purposes;

const purposeOptionsSelector = createSelector(
  purposesSelector,
  (purposes) => {
    const purposeOptions = values(purposes)
      .filter(purpose => purpose.parent === null)
      .map(purpose => ({
        value: purpose.id,
        label: getName(purpose),
      }));
    const alphabetized = sortBy(purposeOptions, 'label');

    return Immutable(alphabetized);
  }
);

export default purposeOptionsSelector;
