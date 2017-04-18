import { expect } from 'chai';

import recurringReservations from './recurringReservations';

describe('state/recurringReservations', () => {
  describe('reducer', () => {
    const reducer = recurringReservations.reducer;

    it('returns correct initial state', () => {
      const expected = {
        baseTime: null,
        frequency: '',
        numberOfOccurrences: 1,
      };
      const actual = reducer(undefined, { type: 'NOOP' });
      expect(actual).to.deep.equal(expected);
    });

    describe('changeBaseTime', () => {
      const changeBaseTime = recurringReservations.changeBaseTime;

      it('changes baseTime to action.payload', () => {
        const state = {
          baseTime: null,
          frequency: 'days',
          numberOfOccurrences: 1,
        };
        const newTime = {
          begin: '2017-04-18T15:00:00.000Z',
          end: '2017-04-18T16:00:00.000Z',
        };
        const actual = reducer(state, changeBaseTime(newTime));
        expect(actual.baseTime).to.deep.equal(newTime);
      });
    });

    describe('changeFrequency', () => {
      const changeFrequency = recurringReservations.changeFrequency;

      it('changes frequency to action.payload', () => {
        const state = {
          baseTime: null,
          frequency: '',
          numberOfOccurrences: 12,
        };
        const actual = reducer(state, changeFrequency('days'));
        expect(actual.frequency).to.equal('days');
      });
    });

    describe('changeNumberOfOccurrences', () => {
      const changeNumberOfOccurrences = recurringReservations.changeNumberOfOccurrences;

      it('changes numberOfOccurrences to action.payload', () => {
        const state = {
          frequency: 'days',
          numberOfOccurrences: 1,
        };
        const actual = reducer(state, changeNumberOfOccurrences(12));
        expect(actual.numberOfOccurrences).to.equal(12);
      });
    });
  });

  describe('selectors', () => {
    describe('select', () => {
      it('returns whole recurringReservations state', () => {
        const state = {
          recurringReservations: { foo: 'bar' },
        };
        expect(recurringReservations.select(state)).to.deep.equal(state.recurringReservations);
      });
    });

    describe('selectBaseTime', () => {
      it('returns recurringReservations.baseTime', () => {
        const state = {
          recurringReservations: { baseTime: { begin: '', end: '' } },
        };
        expect(recurringReservations.selectBaseTime(state)).to.deep.equal(
          state.recurringReservations.baseTime
        );
      });
    });

    describe('selectFrequency', () => {
      it('returns recurringReservations.frequency', () => {
        const state = {
          recurringReservations: { frequency: 'days' },
        };
        expect(recurringReservations.selectFrequency(state)).to.equal(
          state.recurringReservations.frequency
        );
      });
    });

    describe('selectNumberOfOccurrences', () => {
      it('returns recurringReservations.numberOfOccurrences', () => {
        const state = {
          recurringReservations: { numberOfOccurrences: 12 },
        };
        expect(recurringReservations.selectNumberOfOccurrences(state)).to.equal(
          state.recurringReservations.numberOfOccurrences
        );
      });
    });
  });
});
