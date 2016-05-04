import { expect } from 'chai';

import userReservationsPageSelector from 'selectors/containers/userReservationsPageSelector';
import { getDefaultRouterProps, getInitialState } from 'utils/TestUtils';

describe('Selector: userReservationsPageSelector', () => {
  const state = getInitialState();
  const props = getDefaultRouterProps();
  const selected = userReservationsPageSelector(state, props);

  it('should return adminReservationsFilters', () => {
    expect(selected.adminReservationsFilters).to.exist;
  });

  it('should return isAdmin', () => {
    expect(selected.isAdmin).to.exist;
  });

  it('should return reservationsFetchCount', () => {
    expect(selected.reservationsFetchCount).to.exist;
  });

  it('should return resourcesLoaded', () => {
    expect(selected.resourcesLoaded).to.exist;
  });
});
