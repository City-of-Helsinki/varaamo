import { expect } from 'chai';

import { getDefaultRouterProps, getState } from 'utils/testUtils';
import reservationListSelector from './reservationListSelector';

describe('pages/user-reservations/reservation-list/reservationListSelector', () => {
  function getSelected(extraState) {
    const state = getState(extraState);
    const props = getDefaultRouterProps();
    return reservationListSelector(state, props);
  }

  it('returns isAdmin', () => {
    expect(getSelected().isAdmin).to.exist;
  });

  it('returns isFetchingReservations', () => {
    expect(getSelected().isFetchingReservations).to.exist;
  });

  it('returns reservations', () => {
    expect(getSelected().reservations).to.exist;
  });

  it('returns resources from the state', () => {
    expect(getSelected().resources).to.exist;
  });

  it('returns staffUnits', () => {
    expect(getSelected().staffUnits).to.exist;
  });

  it('returns units from the state', () => {
    expect(getSelected().units).to.exist;
  });
});
