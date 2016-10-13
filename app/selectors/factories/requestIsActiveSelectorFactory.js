import { createSelector } from 'reselect';

const requestIsActiveSelectorFactory = (requestActionType) => {
  const activeRequestsSelector = state => state.api.activeRequests;

  return createSelector(
    activeRequestsSelector,
    activeRequests => Boolean(activeRequests[requestActionType])
  );
};

export default requestIsActiveSelectorFactory;
