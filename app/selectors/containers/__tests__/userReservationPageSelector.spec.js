import { expect } from 'chai';

import _ from 'lodash';

import userReservationsPageSelector from 'selectors/containers/userReservationsPageSelector';
import { getInitialState } from 'utils/TestUtils';

describe('Selector: userReservationsPageSelector', () => {
  const state = getInitialState();
  const selected = userReservationsPageSelector(state);

  it('should return isFetchingReservations', () => {
    expect(selected.isFetchingReservations).to.exist;
  });

  it('should return reservations mapped to an array from the state', () => {
    const expected = _.values(state.data.reservations);

    expect(selected.reservations).to.deep.equal(expected);
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
