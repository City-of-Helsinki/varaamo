import { expect } from 'chai';

import { getDefaultRouterProps, getState } from 'utils/testUtils';
import reservationListSelector from './reservationListSelector';

describe('pages/user-reservations/reservation-list/reservationListSelector', () => {
  function getSelected(extraState) {
    const state = getState(extraState);
    const props = getDefaultRouterProps();
    return reservationListSelector(state, props);
  }

  test('returns isAdmin', () => {
    expect(getSelected().isAdmin).to.exist;
  });

  test('returns isFetchingReservations', () => {
    expect(getSelected().isFetchingReservations).to.exist;
  });

  test('returns reservations', () => {
    expect(getSelected().reservations).to.exist;
  });

  test('returns resources from the state', () => {
    expect(getSelected().resources).to.exist;
  });

  test('returns staffUnits', () => {
    expect(getSelected().staffUnits).to.exist;
  });

  test('returns units from the state', () => {
    expect(getSelected().units).to.exist;
  });
});
