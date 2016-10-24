import { expect } from 'chai';

import { getDefaultRouterProps, getInitialState } from 'utils/testUtils';
import reservationSuccessModalSelector from './reservationSuccessModalSelector';

describe('shared/modals/reservation-success/reservationSuccessModalSelector', () => {
  const state = getInitialState();
  const props = getDefaultRouterProps();
  const selected = reservationSuccessModalSelector(state, props);

  it('returns show', () => {
    expect(selected.show).to.exist;
  });

  it('returns reservationsToShow from the state', () => {
    const expected = state.ui.reservations.toShow;

    expect(selected.reservationsToShow).to.deep.equal(expected);
  });

  it('returns resources from the state', () => {
    const expected = state.data.resources;

    expect(selected.resources).to.deep.equal(expected);
  });

  it('returns user', () => {
    expect(selected.user).to.exist;
  });
});
