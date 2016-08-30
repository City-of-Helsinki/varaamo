import { createSelector } from 'reselect';

import isAdminSelector from 'selectors/isAdminSelector';

const adminReservationsFiltersSelector = (state) => state.ui.reservations.adminReservationsFilters;
const reservationsFetchCountSelector = (state) => state.api.fetchCounts.reservations;
const resourcesLoadedSelector = (state) => !state.api.shouldFetch.resources;

const userReservationsPageSelector = createSelector(
  adminReservationsFiltersSelector,
  isAdminSelector,
  reservationsFetchCountSelector,
  resourcesLoadedSelector,
  (
    adminReservationsFilters,
    isAdmin,
    reservationsFetchCount,
    resourcesLoaded
  ) => ({
    adminReservationsFilters,
    isAdmin,
    reservationsFetchCount,
    resourcesLoaded,
  })
);

export default userReservationsPageSelector;
