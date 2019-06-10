import { getState } from '../../../utils/testUtils';
import { selector } from '../connectRecurringReservationControls';

describe('shared/recurring-reservation-controls/connectRecurringReservationControls', () => {
  describe('selector', () => {
    function getSelected(state) {
      return selector(state);
    }

    test('returns frequency from state', () => {
      const frequency = 'days';
      const state = getState({
        recurringReservations: { frequency },
      });
      expect(getSelected(state).frequency).toBe(frequency);
    });

    test('returns lastTime from state', () => {
      const lastTime = '2017-04-18';
      const state = getState({
        recurringReservations: { lastTime },
      });
      expect(getSelected(state).lastTime).toBe(lastTime);
    });

    test('returns frequencyOptions', () => {
      const state = getState();
      expect(getSelected(state).frequencyOptions).toBeDefined();
    });

    describe('isVisible', () => {
      test('returns true if baseTime is set', () => {
        const baseTime = { begin: 'mock-begin', end: 'mock-end' };
        const state = getState({
          recurringReservations: { baseTime },
        });
        expect(getSelected(state).isVisible).toBe(true);
      });

      test('returns false if baseTime is not set', () => {
        const baseTime = null;
        const state = getState({
          recurringReservations: { baseTime },
        });
        expect(getSelected(state).isVisible).toBe(false);
      });
    });

    test('returns numberOfOccurrences from state', () => {
      const numberOfOccurrences = 12;
      const state = getState({
        recurringReservations: { numberOfOccurrences },
      });
      expect(getSelected(state).numberOfOccurrences).toBe(numberOfOccurrences);
    });
  });
});
