import _ from 'lodash';
import { createSelector } from 'reselect';
import Immutable from 'seamless-immutable';

import { getName } from 'utils/DataUtils';

const purposesSelector = (state) => state.data.purposes;

const purposeOptionsSelector = createSelector(
  purposesSelector,
  (purposes) => {
    const purposeOptions = _.filter(
      _.values(purposes), (purpose) => purpose.parent !== null
    ).map(purpose => {
      return {
        value: purpose.id,
        label: getName(purpose),
      };
    });
    const alphabetized = _.sortBy(purposeOptions, 'label');

    return Immutable(alphabetized);
  }
);

export default purposeOptionsSelector;
