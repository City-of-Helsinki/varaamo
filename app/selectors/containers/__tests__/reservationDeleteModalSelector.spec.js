import { expect } from 'chai';

import reservationDeleteModalSelector from 'selectors/containers/reservationDeleteModalSelector';
import { getDefaultRouterProps, getInitialState } from 'utils/TestUtils';

describe('Selector: reservationDeleteModalSelector', () => {
  const state = getInitialState();
  const props = getDefaultRouterProps();
  const selected = reservationDeleteModalSelector(state, props);

  it('should return show', () => {
    expect(selected.show).to.exist;
  });

  it('should return isDeletingReservations', () => {
    expect(selected.isDeletingReservations).to.exist;
  });

  it('should return reservationsToDelete from the state', () => {
    const expected = state.ui.reservations.toDelete;

    expect(selected.reservationsToDelete).to.deep.equal(expected);
  });

  it('should return resources from the state', () => {
    const expected = state.data.resources;

    expect(selected.resources).to.deep.equal(expected);
  });
});
