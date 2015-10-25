import { createSelector } from 'reselect';

const requestIsActiveSelectorFactory = (requestActionType) => {
  const activeRequestsSelector = (state) => state.api.activeRequests;

  return createSelector(
    activeRequestsSelector,
    (activeRequests) => {
      return Boolean(activeRequests[requestActionType]);
    }
  );
};

export default requestIsActiveSelectorFactory;
