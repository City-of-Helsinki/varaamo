import { expect } from 'chai';

import reservationSuccessModalSelector from 'selectors/containers/reservationSuccessModalSelector';
import { getDefaultRouterProps, getInitialState } from 'utils/TestUtils';

describe('Selector: reservationSuccessModalSelector', () => {
  const state = getInitialState();
  const props = getDefaultRouterProps();
  const selected = reservationSuccessModalSelector(state, props);

  it('should return show', () => {
    expect(selected.show).to.exist;
  });

  it('should return reservationsToShow from the state', () => {
    const expected = state.ui.reservations.toShow;

    expect(selected.reservationsToShow).to.deep.equal(expected);
  });

  it('should return resources from the state', () => {
    const expected = state.data.resources;

    expect(selected.resources).to.deep.equal(expected);
  });
});
