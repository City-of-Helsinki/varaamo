import { expect } from 'chai';

import { getDefaultRouterProps, getInitialState } from 'utils/testUtils';
import reservationListSelector from './reservationListSelector';

describe('pages/user-reservations/reservation-list/reservationListSelector', () => {
  const state = getInitialState();
  const props = getDefaultRouterProps();
  const selected = reservationListSelector(state, props);

  it('returns isAdmin', () => {
    expect(selected.isAdmin).to.exist;
  });

  it('returns isFetchingReservations', () => {
    expect(selected.isFetchingReservations).to.exist;
  });

  it('returns reservations', () => {
    expect(selected.reservations).to.exist;
  });

  it('returns resources from the state', () => {
    const expected = state.data.resources;

    expect(selected.resources).to.deep.equal(expected);
  });

  it('returns staffUnits', () => {
    expect(selected.staffUnits).to.exist;
  });

  it('returns units from the state', () => {
    const expected = state.data.units;

    expect(selected.units).to.deep.equal(expected);
  });
});
