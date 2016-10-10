import { expect } from 'chai';

import Resource from 'fixtures/Resource';
import { getState } from 'utils/testUtils';
import reservationConfirmationSelector from './reservationConfirmationSelector';

describe('screens/resource/reservation-confirmation/reservationConfirmationSelector', () => {
  const resource = Resource.build();
  const state = getState({
    'data.resources': { [resource.id]: resource },
    'ui.reservations.toEdit': ['mock-reservation'],
  });
  const props = {
    params: { id: resource.id },
  };
  const selected = reservationConfirmationSelector(state, props);

  it('returns confirmReservationModalIsOpen', () => {
    expect(selected.confirmReservationModalIsOpen).to.exist;
  });

  it('returns isMakingReservations', () => {
    expect(selected.isMakingReservations).to.exist;
  });

  it('returns reservationsToEdit from the state', () => {
    const expected = state.ui.reservations.toEdit;

    expect(selected.reservationsToEdit).to.deep.equal(expected);
  });

  it('returns resource', () => {
    expect(selected.resource).to.exist;
  });

  it('returns selectedReservations', () => {
    expect(selected.selectedReservations).to.exist;
  });

  it('returns staffUnits', () => {
    expect(selected.staffUnits).to.exist;
  });
});
