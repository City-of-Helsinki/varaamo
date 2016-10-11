import { expect } from 'chai';

import { getDefaultRouterProps, getInitialState } from 'utils/testUtils';
import reservationCancelModalSelector from './reservationCancelModalSelector';

describe('shared/modals/reservation-cancel/reservationCancelModalSelector', () => {
  const state = getInitialState();
  const props = getDefaultRouterProps();
  const selected = reservationCancelModalSelector(state, props);

  it('returns isAdmin', () => {
    expect(selected.isAdmin).to.exist;
  });

  it('returns isCancellingReservations', () => {
    expect(selected.isCancellingReservations).to.exist;
  });

  it('returns show', () => {
    expect(selected.show).to.exist;
  });

  it('returns reservationsToCancel from the state', () => {
    const expected = state.ui.reservations.toCancel;

    expect(selected.reservationsToCancel).to.deep.equal(expected);
  });

  it('returns resources from the state', () => {
    const expected = state.data.resources;

    expect(selected.resources).to.deep.equal(expected);
  });
});
