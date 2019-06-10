import { getState } from '../../utils/testUtils';
import userReservationsPageSelector from './userReservationsPageSelector';

describe('pages/user-reservations/userReservationsPageSelector', () => {
  function getSelected(extraState) {
    const state = getState(extraState);
    return userReservationsPageSelector(state);
  }

  test('returns adminReservationFilters', () => {
    expect(getSelected().adminReservationFilters).toBeDefined();
  });

  test('returns isAdmin', () => {
    expect(getSelected().isAdmin).toBeDefined();
  });

  test('returns reservationsFetchCount', () => {
    expect(getSelected().reservationsFetchCount).toBeDefined();
  });

  test('returns resourcesLoaded', () => {
    expect(getSelected().resourcesLoaded).toBeDefined();
  });
});
