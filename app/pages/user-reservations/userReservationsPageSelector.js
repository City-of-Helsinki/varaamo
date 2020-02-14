import { createStructuredSelector } from 'reselect';

import { isAdminSelector } from '../../state/selectors/authSelectors';

const resourcesLoadedSelector = state => !state.api.shouldFetch.resources;
const reservationsLoadingSelector = state => state.api.activeRequests.RESERVATIONS_GET_REQUEST === 1;

const userReservationsPageSelector = createStructuredSelector({
  isAdmin: isAdminSelector,
  resourcesLoaded: resourcesLoadedSelector,
  reservationsLoading: reservationsLoadingSelector,
});

export default userReservationsPageSelector;
