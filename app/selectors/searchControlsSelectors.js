import _ from 'lodash';
import { createSelector } from 'reselect';
import Immutable from 'seamless-immutable';

import types from 'constants/ActionTypes';
import { getName } from 'utils/DataUtils';
import { getDateString } from 'utils/TimeUtils';

const activeRequestsSelector = (state) => state.api.activeRequests;
const filtersSelector = (state) => state.ui.search.filters;
const purposesSelector = (state) => state.data.purposes;

export const searchControlsSelectors = createSelector(
  activeRequestsSelector,
  filtersSelector,
  purposesSelector,
  (
    activeRequests,
    filters,
    purposes
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
      filters: Object.assign({}, filters, { date: getDateString(filters.date) }),
      purposeOptions,
    };
  }
);
