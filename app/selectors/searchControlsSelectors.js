import _ from 'lodash';
import { createSelector } from 'reselect';
import Immutable from 'seamless-immutable';

import { getName } from 'utils/DataUtils';

const isFetchingPurposesSelector = (state) => state.api.isFetchingPurposes;
const filtersSelector = (state) => state.ui.search.filters;
const purposesSelector = (state) => state.data.purposes;

export const searchControlsSelectors = createSelector(
  isFetchingPurposesSelector,
  filtersSelector,
  purposesSelector,
  (
    isFetchingPurposes,
    filters,
    purposes
  ) => {
    const purposeOptions = Immutable(_.values(purposes).map(purpose => {
      return {
        value: purpose.id,
        label: getName(purpose),
      };
    }));

    return {
      isFetchingPurposes,
      filters,
      purposeOptions,
    };
  }
);
