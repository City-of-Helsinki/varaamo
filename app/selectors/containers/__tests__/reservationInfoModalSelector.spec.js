import { expect } from 'chai';

import reservationInfoModalSelector from 'selectors/containers/reservationInfoModalSelector';
import { getDefaultRouterProps, getInitialState } from 'utils/TestUtils';

describe('Selector: reservationInfoModalSelector', () => {
  const state = getInitialState();
  const props = getDefaultRouterProps();
  const selected = reservationInfoModalSelector(state, props);

  it('should return isEditingReservations', () => {
    expect(selected.isEditingReservations).to.exist;
  });

  it('should return show', () => {
    expect(selected.show).to.exist;
  });

  it('should return reservationsToShow from the state', () => {
    const expected = state.ui.reservation.toShow;

    expect(selected.reservationsToShow).to.deep.equal(expected);
  });

  it('should return resources from the state', () => {
    const expected = state.data.resources;

    expect(selected.resources).to.deep.equal(expected);
  });

  it('should return staffUnits', () => {
    expect(selected.resources).to.exist;
  });
});
