import { expect } from 'chai';

import reservationDeleteModalSelector from 'selectors/containers/reservationDeleteModalSelector';
import { getInitialState } from 'utils/TestUtils';

describe('Selector: reservationDeleteModalSelector', () => {
  const state = getInitialState();
  const selected = reservationDeleteModalSelector(state);

  it('should return show', () => {
    expect(selected.show).to.exist;
  });

  it('should return isDeletingReservations', () => {
    expect(selected.isDeletingReservations).to.exist;
  });

  it('should return reservationsToDelete from the state', () => {
    const expected = state.ui.reservation.toDelete;

    expect(selected.reservationsToDelete).to.deep.equal(expected);
  });

  it('should return resources from the state', () => {
    const expected = state.data.resources;

    expect(selected.resources).to.deep.equal(expected);
  });
});
