import _ from 'lodash';
import { createSelector } from 'reselect';
import Immutable from 'seamless-immutable';

import types from 'constants/ActionTypes';
import searchFiltersSelector from 'selectors/searchFiltersSelector';
import { getName } from 'utils/DataUtils';

const activeRequestsSelector = (state) => state.api.activeRequests;
const purposesSelector = (state) => state.data.purposes;

export const searchControlsSelectors = createSelector(
  activeRequestsSelector,
  purposesSelector,
  searchFiltersSelector,
  (
    activeRequests,
    purposes,
    searchFilters
  ) => {
    const isFetchingPurposes = _.includes(activeRequests, types.API.PURPOSES_GET_REQUEST);
    const purposeOptions = Immutable(_.values(purposes).map(purpose => {
      return {
        value: purpose.id,
        label: getName(purpose),
      };
    }));

    return {
      isFetchingPurposes,
      filters: searchFilters,
      purposeOptions,
    };
  }
);
