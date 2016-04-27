import { createSelector } from 'reselect';

import isAdminSelector from 'selectors/isAdminSelector';

const resourcesLoadedSelector = (state) => !state.api.shouldFetch.resources;

const userReservationsPageSelector = createSelector(
  isAdminSelector,
  resourcesLoadedSelector,
  (
    isAdmin,
    resourcesLoaded
  ) => {
    return {
      isAdmin,
      resourcesLoaded,
    };
  }
);

export default userReservationsPageSelector;
