import { getState } from '../../../utils/testUtils';
import userReservationsPageSelector from '../userReservationsPageSelector';

describe('pages/user-reservations/userReservationsPageSelector', () => {
  function getSelected(extraState) {
    const state = getState(extraState);
    return userReservationsPageSelector(state);
  }

  test('returns isAdmin', () => {
    expect(getSelected().isAdmin).toBeDefined();
  });
});
