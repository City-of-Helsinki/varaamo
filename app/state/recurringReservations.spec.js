import { expect } from 'chai';

import recurringReservations, { populateReservations } from './recurringReservations';

describe('state/recurringReservations', () => {
  describe('reducer', () => {
    const reducer = recurringReservations.reducer;

    it('returns correct initial state', () => {
      const expected = {
        baseTime: null,
        frequency: '',
        numberOfOccurrences: 1,
        reservations: [],
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

      it('updates reservations', () => {
        const state = {
          baseTime: {
            begin: '2017-04-18T15:00:00.000Z',
            end: '2017-04-18T16:00:00.000Z',
          },
          frequency: '',
          numberOfOccurrences: 1,
          reservations: [],
        };
        const reservations = reducer(state, changeFrequency('days')).reservations;
        const expected = [{
          begin: '2017-04-19T15:00:00.000Z',
          end: '2017-04-19T16:00:00.000Z',
        }];
        expect(reservations).to.deep.equal(expected);
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

      it('updates reservations', () => {
        const state = {
          baseTime: {
            begin: '2017-04-18T15:00:00.000Z',
            end: '2017-04-18T16:00:00.000Z',
          },
          frequency: 'days',
          numberOfOccurrences: 1,
          reservations: [],
        };
        const reservations = reducer(state, changeNumberOfOccurrences(2)).reservations;
        const expected = [
          {
            begin: '2017-04-19T15:00:00.000Z',
            end: '2017-04-19T16:00:00.000Z',
          },
          {
            begin: '2017-04-20T15:00:00.000Z',
            end: '2017-04-20T16:00:00.000Z',
          },
        ];
        expect(reservations).to.deep.equal(expected);
      });
    });
  });

  describe('populateReservations helper function', () => {
    function getReservations(state) {
      const defaults = {
        baseTime: null,
        frequency: '',
        numberOfOccurrences: 1,
      };
      return populateReservations({ ...defaults, ...state });
    }

    it('returns an empty array if baseTime is not set', () => {
      const reservations = getReservations({ baseTime: null, frequency: 'days' });
      expect(reservations).to.deep.equal([]);
    });

    it('returns an empty array if frequency is not set', () => {
      const reservations = getReservations({ baseTime: { foo: 'bar' }, frequency: '' });
      expect(reservations).to.deep.equal([]);
    });

    it('populates reservations correctly when frequency is "days"', () => {
      const baseTime = {
        begin: '2017-04-18T15:00:00.000Z',
        end: '2017-04-18T16:00:00.000Z',
      };
      const frequency = 'days';
      const numberOfOccurrences = 3;
      const reservations = getReservations({ baseTime, frequency, numberOfOccurrences });
      const expected = [
        {
          begin: '2017-04-19T15:00:00.000Z',
          end: '2017-04-19T16:00:00.000Z',
        },
        {
          begin: '2017-04-20T15:00:00.000Z',
          end: '2017-04-20T16:00:00.000Z',
        },
        {
          begin: '2017-04-21T15:00:00.000Z',
          end: '2017-04-21T16:00:00.000Z',
        },
      ];
      expect(reservations).to.deep.equal(expected);
    });

    it('populates reservations correctly when frequency is "weeks"', () => {
      const baseTime = {
        begin: '2017-04-18T15:00:00.000Z',
        end: '2017-04-18T16:00:00.000Z',
      };
      const frequency = 'weeks';
      const numberOfOccurrences = 3;
      const reservations = getReservations({ baseTime, frequency, numberOfOccurrences });
      const expected = [
        {
          begin: '2017-04-25T15:00:00.000Z',
          end: '2017-04-25T16:00:00.000Z',
        },
        {
          begin: '2017-05-02T15:00:00.000Z',
          end: '2017-05-02T16:00:00.000Z',
        },
        {
          begin: '2017-05-09T15:00:00.000Z',
          end: '2017-05-09T16:00:00.000Z',
        },
      ];
      expect(reservations).to.deep.equal(expected);
    });

    it('populates reservations correctly when frequency is "months"', () => {
      const baseTime = {
        begin: '2017-04-18T15:00:00.000Z',
        end: '2017-04-18T16:00:00.000Z',
      };
      const frequency = 'months';
      const numberOfOccurrences = 3;
      const reservations = getReservations({ baseTime, frequency, numberOfOccurrences });
      const expected = [
        {
          begin: '2017-05-18T15:00:00.000Z',
          end: '2017-05-18T16:00:00.000Z',
        },
        {
          begin: '2017-06-18T15:00:00.000Z',
          end: '2017-06-18T16:00:00.000Z',
        },
        {
          begin: '2017-07-18T15:00:00.000Z',
          end: '2017-07-18T16:00:00.000Z',
        },
      ];
      expect(reservations).to.deep.equal(expected);
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

    describe('selectReservations', () => {
      it('returns recurringReservations.reservations', () => {
        const state = {
          recurringReservations: {
            reservations: [{ begin: '', end: '' }, { begin: '', end: '' }],
          },
        };
        expect(recurringReservations.selectReservations(state)).to.deep.equal(
          state.recurringReservations.reservations
        );
      });
    });
  });
});
