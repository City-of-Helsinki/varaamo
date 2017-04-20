import { expect } from 'chai';

import { getState } from 'utils/testUtils';
import { selector } from './connectRecurringReservationControls';

describe('shared/recurring-reservation-controls/connectRecurringReservationControls', () => {
  describe('selector', () => {
    function getSelected(state) {
      return selector(state);
    }

    it('returns frequency from state', () => {
      const frequency = 'days';
      const state = getState({
        recurringReservations: { frequency },
      });
      expect(getSelected(state).frequency).to.equal(frequency);
    });

    it('returns lastTime from state', () => {
      const lastTime = '2017-04-18';
      const state = getState({
        recurringReservations: { lastTime },
      });
      expect(getSelected(state).lastTime).to.equal(lastTime);
    });

    it('returns frequencyOptions', () => {
      const state = getState();
      expect(getSelected(state).frequencyOptions).to.exist;
    });

    describe('isVisible', () => {
      it('returns true if baseTime is set', () => {
        const baseTime = { begin: 'mock-begin', end: 'mock-end' };
        const state = getState({
          recurringReservations: { baseTime },
        });
        expect(getSelected(state).isVisible).to.be.true;
      });

      it('returns false if baseTime is not set', () => {
        const baseTime = null;
        const state = getState({
          recurringReservations: { baseTime },
        });
        expect(getSelected(state).isVisible).to.be.false;
      });
    });

    it('returns numberOfOccurrences from state', () => {
      const numberOfOccurrences = 12;
      const state = getState({
        recurringReservations: { numberOfOccurrences },
      });
      expect(getSelected(state).numberOfOccurrences).to.equal(numberOfOccurrences);
    });
  });
});
