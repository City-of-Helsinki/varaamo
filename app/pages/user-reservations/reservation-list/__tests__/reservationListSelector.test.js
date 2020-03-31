import { getDefaultRouterProps, getState } from '../../../../utils/testUtils';
import reservationListSelector from '../reservationListSelector';

describe('pages/user-reservations/reservation-list/reservationListSelector', () => {
  function getSelected(extraState) {
    const state = getState(extraState);
    const props = getDefaultRouterProps();
    return reservationListSelector(state, props);
  }

  test('returns isAdmin', () => {
    expect(getSelected().isAdmin).toBeDefined();
  });
});
