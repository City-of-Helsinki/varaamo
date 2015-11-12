import { expect } from 'chai';

import reservationsListSelector from 'selectors/containers/reservationsListSelector';
import { getInitialState } from 'utils/TestUtils';

describe('Selector: reservationsListSelector', () => {
  const state = getInitialState();
  const selected = reservationsListSelector(state);

  it('should return deleteReservationModalIsOpen', () => {
    expect(selected.deleteReservationModalIsOpen).to.exist;
  });

  it('should return isDeletingReservations', () => {
    expect(selected.isDeletingReservations).to.exist;
  });

  it('should return isFetchingReservations', () => {
    expect(selected.isFetchingReservations).to.exist;
  });

  it('should return reservations', () => {
    expect(selected.reservations).to.exist;
  });

  it('should return reservationsToDelete from the state', () => {
    const expected = state.ui.reservation.toDelete;

    expect(selected.reservationsToDelete).to.deep.equal(expected);
  });

  it('should return resources from the state', () => {
    const expected = state.data.resources;

    expect(selected.resources).to.deep.equal(expected);
  });

  it('should return units from the state', () => {
    const expected = state.data.units;

    expect(selected.units).to.deep.equal(expected);
  });
});
