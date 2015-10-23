import _ from 'lodash';
import { createSelector } from 'reselect';
import Immutable from 'seamless-immutable';

import { getName } from 'utils/DataUtils';

const purposesSelector = (state) => state.data.purposes;

const purposeOptionsSelector = createSelector(
  purposesSelector,
  (purposes) => {
    const purposeOptions = Immutable(_.values(purposes).map(purpose => {
      return {
        value: purpose.id,
        label: getName(purpose),
      };
    }));

    return purposeOptions;
  }
);

export default purposeOptionsSelector;
