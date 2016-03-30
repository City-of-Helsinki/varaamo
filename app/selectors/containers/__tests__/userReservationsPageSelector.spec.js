import { expect } from 'chai';

import userReservationsPageSelector from 'selectors/containers/userReservationsPageSelector';
import { getDefaultRouterProps, getInitialState } from 'utils/TestUtils';

describe('Selector: userReservationsPageSelector', () => {
  const state = getInitialState();
  const props = getDefaultRouterProps();
  const selected = userReservationsPageSelector(state, props);

  it('should return isAdmin', () => {
    expect(selected.isAdmin).to.exist;
  });

  it('should return isFetchingResources', () => {
    expect(selected.isFetchingResources).to.exist;
  });
});
