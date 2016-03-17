import { expect } from 'chai';

import reservationCancelModalSelector from 'selectors/containers/reservationCancelModalSelector';
import { getDefaultRouterProps, getInitialState } from 'utils/TestUtils';

describe('Selector: reservationCancelModalSelector', () => {
  const state = getInitialState();
  const props = getDefaultRouterProps();
  const selected = reservationCancelModalSelector(state, props);

  it('should return show', () => {
    expect(selected.show).to.exist;
  });

  it('should return reservationsToCancel from the state', () => {
    const expected = state.ui.reservation.toCancel;

    expect(selected.reservationsToCancel).to.deep.equal(expected);
  });

  it('should return resources from the state', () => {
    const expected = state.data.resources;

    expect(selected.resources).to.deep.equal(expected);
  });
});
