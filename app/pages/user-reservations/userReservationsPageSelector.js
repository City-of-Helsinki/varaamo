import { createSelector } from 'reselect';

import isAdminSelector from 'state/selectors/isAdminSelector';

const adminReservationFiltersSelector = state => state.ui.reservations.adminReservationFilters;
const reservationsFetchCountSelector = state => state.api.fetchCounts.reservations;
const resourcesLoadedSelector = state => !state.api.shouldFetch.resources;

const userReservationsPageSelector = createSelector(
  adminReservationFiltersSelector,
  isAdminSelector,
  reservationsFetchCountSelector,
  resourcesLoadedSelector,
  (
    adminReservationFilters,
    isAdmin,
    reservationsFetchCount,
    resourcesLoaded
  ) => ({
    adminReservationFilters,
    isAdmin,
    reservationsFetchCount,
    resourcesLoaded,
  })
);

export default userReservationsPageSelector;
