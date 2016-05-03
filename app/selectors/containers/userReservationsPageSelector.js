import { createSelector } from 'reselect';

import isAdminSelector from 'selectors/isAdminSelector';

const adminReservationsFiltersSelector = (state) => state.ui.reservations.adminReservationsFilters;
const resourcesLoadedSelector = (state) => !state.api.shouldFetch.resources;

const userReservationsPageSelector = createSelector(
  adminReservationsFiltersSelector,
  isAdminSelector,
  resourcesLoadedSelector,
  (
    adminReservationsFilters,
    isAdmin,
    resourcesLoaded
  ) => {
    return {
      adminReservationsFilters,
      isAdmin,
      resourcesLoaded,
    };
  }
);

export default userReservationsPageSelector;
