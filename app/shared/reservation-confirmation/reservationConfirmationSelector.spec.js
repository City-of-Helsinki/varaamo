import FormTypes from 'constants/FormTypes';

import { expect } from 'chai';

import Resource from 'utils/fixtures/Resource';
import { getState } from 'utils/testUtils';
import reservationConfirmationSelector from './reservationConfirmationSelector';

describe('shared/reservation-confirmation/reservationConfirmationSelector', () => {
  const resource = Resource.build();
  const recurringReservations = ['mock-recurring-reservation'];

  function getSelected(extraProps) {
    const state = getState({
      'data.resources': { [resource.id]: resource },
      [`form.${FormTypes.RESERVATION}.values`]: { staffEvent: true },
      recurringReservations: { reservations: recurringReservations },
      'ui.reservations.toEdit': ['mock-reservation'],
    });
    const props = {
      params: { id: resource.id },
      ...extraProps,
    };
    return reservationConfirmationSelector(state, props);
  }

  it('returns confirmReservationModalIsOpen', () => {
    expect(getSelected().confirmReservationModalIsOpen).to.exist;
  });

  it('returns isMakingReservations', () => {
    expect(getSelected().isMakingReservations).to.exist;
  });

  it('returns isStaff', () => {
    expect(getSelected().isStaff).to.exist;
  });

  it('returns recurringReservations from the state', () => {
    expect(getSelected().recurringReservations).to.deep.equal(recurringReservations);
  });

  it('returns reservationsToEdit from the state', () => {
    expect(getSelected().reservationsToEdit).to.deep.equal(['mock-reservation']);
  });

  it('returns correct resource', () => {
    expect(getSelected().resource).to.deep.equal(resource);
  });

  it('returns selectedReservations', () => {
    expect(getSelected().selectedReservations).to.exist;
  });

  it('returns selectedReservations from props', () => {
    const selectedReservations = { some: 'data' };
    const selected = getSelected({ selectedReservations });
    expect(selected.selectedReservations).to.equal(selectedReservations);
  });

  it('returns staffEventSelected from state', () => {
    expect(getSelected().staffEventSelected).to.be.true;
  });
});
