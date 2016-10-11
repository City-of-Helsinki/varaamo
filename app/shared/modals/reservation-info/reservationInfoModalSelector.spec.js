import { expect } from 'chai';

import { getState } from 'utils/testUtils';
import reservationInfoModalSelector from './reservationInfoModalSelector';

describe('shared/modals/reservation-info/reservationInfoModalSelector', () => {
  const resource = { id: 'resource-1' };
  const reservationsToShow = [{ id: 'reservation-1', resource: resource.id }];
  const state = getState({
    'data.resources': { [resource.id]: resource },
    'ui.reservations.toShow': reservationsToShow,
  });
  const selected = reservationInfoModalSelector(state);

  it('returns isAdmin', () => {
    expect(selected.isAdmin).to.exist;
  });

  it('returns isEditingReservations', () => {
    expect(selected.isEditingReservations).to.exist;
  });

  it('returns correct reservation from the state', () => {
    const expected = reservationsToShow[0];

    expect(selected.reservation).to.deep.equal(expected);
  });

  it('returns correct resource from the state', () => {
    const expected = resource;

    expect(selected.resource).to.deep.equal(expected);
  });

  it('returns show', () => {
    expect(selected.show).to.exist;
  });

  it('returns staffUnits', () => {
    expect(selected.staffUnits).to.exist;
  });
});
