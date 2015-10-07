import _ from 'lodash';
import { createSelector } from 'reselect';
import Immutable from 'seamless-immutable';

import { getName } from 'utils/DataUtils';

const isFetchingPurposesSelector = (state) => state.api.isFetchingPurposes;
const purposeFilterSelector = (state) => state.ui.search.purposeFilter;
const purposesSelector = (state) => state.data.purposes;

export const searchControlsSelectors = createSelector(
  isFetchingPurposesSelector,
  purposeFilterSelector,
  purposesSelector,
  (isFetchingPurposes, purposeFilter, purposes) => {
    const purposeOptions = _.values(purposes).map(purpose => {
      return {
        value: purpose.id,
        label: getName(purpose),
      };
    });

    return {
      isFetchingPurposes,
      purposeFilter,
      purposeOptions: Immutable(purposeOptions),
    };
  }
);
