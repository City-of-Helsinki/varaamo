import { expect } from 'chai';

import reservationsListSelector from 'selectors/containers/reservationsListSelector';
import { getDefaultRouterProps, getInitialState } from 'utils/TestUtils';

describe('Selector: reservationsListSelector', () => {
  const state = getInitialState();
  const props = getDefaultRouterProps();
  const selected = reservationsListSelector(state, props);

  it('should return isAdmin', () => {
    expect(selected.isAdmin).to.exist;
  });

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
