import _ from 'lodash';
import { createSelector } from 'reselect';

const requestIsActiveSelectorFactory = (requestActionType) => {
  const activeRequestsSelector = (state) => state.api.activeRequests;

  return createSelector(
    activeRequestsSelector,
    (activeRequests) => {
      return _.includes(activeRequests, requestActionType);
    }
  );
};

export default requestIsActiveSelectorFactory;
