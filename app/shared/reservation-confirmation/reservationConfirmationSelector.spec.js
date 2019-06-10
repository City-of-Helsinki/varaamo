import FormTypes from '../../constants/FormTypes';
import Resource from '../../utils/fixtures/Resource';
import { getState } from '../../utils/testUtils';
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

  test('returns confirmReservationModalIsOpen', () => {
    expect(getSelected().confirmReservationModalIsOpen).toBeDefined();
  });

  test('returns isMakingReservations', () => {
    expect(getSelected().isMakingReservations).toBeDefined();
  });

  test('returns isStaff', () => {
    expect(getSelected().isStaff).toBeDefined();
  });

  test('returns recurringReservations from the state', () => {
    expect(getSelected().recurringReservations).toEqual(recurringReservations);
  });

  test('returns reservationsToEdit from the state', () => {
    expect(getSelected().reservationsToEdit).toEqual(['mock-reservation']);
  });

  test('returns correct resource', () => {
    expect(getSelected().resource).toEqual(resource);
  });

  test('returns selectedReservations', () => {
    expect(getSelected().selectedReservations).toBeDefined();
  });

  test('returns selectedReservations from props', () => {
    const selectedReservations = { some: 'data' };
    const selected = getSelected({ selectedReservations });
    expect(selected.selectedReservations).toBe(selectedReservations);
  });

  test('returns staffEventSelected from state', () => {
    expect(getSelected().staffEventSelected).toBe(true);
  });
});
