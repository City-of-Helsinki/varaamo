import { expect } from 'chai';

import { getDefaultRouterProps, getInitialState } from 'utils/testUtils';
import userReservationsPageSelector from './userReservationsPageSelector';

describe('screens/user-reservations/userReservationsPageSelector', () => {
  const state = getInitialState();
  const props = getDefaultRouterProps();
  const selected = userReservationsPageSelector(state, props);

  it('returns adminReservationsFilters', () => {
    expect(selected.adminReservationsFilters).to.exist;
  });

  it('returns isAdmin', () => {
    expect(selected.isAdmin).to.exist;
  });

  it('returns reservationsFetchCount', () => {
    expect(selected.reservationsFetchCount).to.exist;
  });

  it('returns resourcesLoaded', () => {
    expect(selected.resourcesLoaded).to.exist;
  });
});
