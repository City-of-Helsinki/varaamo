import { expect } from 'chai';

import userReservationsPageSelector from 'selectors/containers/userReservationsPageSelector';
import { getInitialState } from 'utils/TestUtils';

describe('Selector: userReservationsPageSelector', () => {
  const state = getInitialState();
  const selected = userReservationsPageSelector(state);

  it('should return isFetchingReservations', () => {
    expect(selected.isFetchingReservations).to.exist;
  });

  it('should return reservations', () => {
    expect(selected.reservations).to.exist;
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
