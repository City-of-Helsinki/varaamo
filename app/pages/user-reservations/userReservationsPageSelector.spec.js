import { expect } from 'chai';

import { getState } from 'utils/testUtils';
import userReservationsPageSelector from './userReservationsPageSelector';

describe('pages/user-reservations/userReservationsPageSelector', () => {
  function getSelected(extraState) {
    const state = getState(extraState);
    return userReservationsPageSelector(state);
  }

  test('returns adminReservationFilters', () => {
    expect(getSelected().adminReservationFilters).to.exist;
  });

  test('returns isAdmin', () => {
    expect(getSelected().isAdmin).to.exist;
  });

  test('returns reservationsFetchCount', () => {
    expect(getSelected().reservationsFetchCount).to.exist;
  });

  test('returns resourcesLoaded', () => {
    expect(getSelected().resourcesLoaded).to.exist;
  });
});
