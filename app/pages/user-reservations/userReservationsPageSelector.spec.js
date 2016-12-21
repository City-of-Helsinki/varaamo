import { expect } from 'chai';

import { getState } from 'utils/testUtils';
import userReservationsPageSelector from './userReservationsPageSelector';

describe('pages/user-reservations/userReservationsPageSelector', () => {
  function getSelected(extraState) {
    const state = getState(extraState);
    return userReservationsPageSelector(state);
  }

  it('returns adminReservationFilters', () => {
    expect(getSelected().adminReservationFilters).to.exist;
  });

  it('returns isAdmin', () => {
    expect(getSelected().isAdmin).to.exist;
  });

  it('returns reservationsFetchCount', () => {
    expect(getSelected().reservationsFetchCount).to.exist;
  });

  it('returns resourcesLoaded', () => {
    expect(getSelected().resourcesLoaded).to.exist;
  });
});
