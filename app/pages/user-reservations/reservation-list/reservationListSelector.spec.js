import { getDefaultRouterProps, getState } from '../../../utils/testUtils';
import reservationListSelector from './reservationListSelector';

describe('pages/user-reservations/reservation-list/reservationListSelector', () => {
  function getSelected(extraState) {
    const state = getState(extraState);
    const props = getDefaultRouterProps();
    return reservationListSelector(state, props);
  }

  test('returns isAdmin', () => {
    expect(getSelected().isAdmin).toBeDefined();
  });

  test('returns isFetchingReservations', () => {
    expect(getSelected().isFetchingReservations).toBeDefined();
  });

  test('returns reservations', () => {
    expect(getSelected().reservations).toBeDefined();
  });

  test('returns resources from the state', () => {
    expect(getSelected().resources).toBeDefined();
  });

  test('returns staffUnits', () => {
    expect(getSelected().staffUnits).toBeDefined();
  });

  test('returns units from the state', () => {
    expect(getSelected().units).toBeDefined();
  });
});
