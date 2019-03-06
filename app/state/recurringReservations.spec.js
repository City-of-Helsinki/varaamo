import { expect } from 'chai';

import {
  closeConfirmReservationModal,
  closeReservationCommentModal,
  closeReservationSuccessModal,
} from 'actions/uiActions';
import recurringReservations, { populateReservations } from './recurringReservations';

describe('state/recurringReservations', () => {
  describe('reducer', () => {
    const reducer = recurringReservations.reducer;
    const initialState = {
      baseTime: null,
      frequency: '',
      lastTime: null,
      numberOfOccurrences: 1,
      reservations: [],
    };

    test('returns correct initial state', () => {
      const actual = reducer(undefined, { type: 'NOOP' });
      expect(actual).to.deep.equal(initialState);
    });

    describe('changeBaseTime', () => {
      const changeBaseTime = recurringReservations.changeBaseTime;

      test('changes baseTime to action.payload', () => {
        const state = {
          ...initialState,
          frequency: 'days',
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

      test('changes frequency to action.payload', () => {
        const state = {
          ...initialState,
          numberOfOccurrences: 12,
        };
        const actual = reducer(state, changeFrequency('days'));
        expect(actual.frequency).to.equal('days');
      });

      test('updates reservations', () => {
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

      test('updates lastTime', () => {
        const baseTime = {
          begin: '2017-04-18T15:00:00.000Z',
          end: '2017-04-18T16:00:00.000Z',
        };
        const state = {
          ...initialState,
          baseTime,
          numberOfOccurrences: 1,
        };
        const actual = reducer(state, changeFrequency('weeks'));
        const expectedLastTime = '2017-04-25';
        expect(actual.lastTime).to.deep.equal(expectedLastTime);
      });
    });

    describe('changeNumberOfOccurrences', () => {
      const changeNumberOfOccurrences = recurringReservations.changeNumberOfOccurrences;

      test('changes numberOfOccurrences to action.payload', () => {
        const state = {
          ...initialState,
          frequency: 'days',
        };
        const actual = reducer(state, changeNumberOfOccurrences(12));
        expect(actual.numberOfOccurrences).to.equal(12);
      });

      test('updates reservations', () => {
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

      test('updates lastTime', () => {
        const baseTime = {
          begin: '2017-04-18T15:00:00.000Z',
          end: '2017-04-18T16:00:00.000Z',
        };
        const state = {
          baseTime,
          frequency: 'days',
          numberOfOccurrences: 1,
          lastTime: null,
        };
        const expectedLastTime = '2017-04-20';
        const actual = reducer(state, changeNumberOfOccurrences(2));
        expect(actual.lastTime).to.deep.equal(expectedLastTime);
      });

      test('has a maximum of 2 years', () => {
        const state = {
          baseTime: {
            begin: '2017-04-18T15:00:00.000Z',
            end: '2017-04-18T16:00:00.000Z',
          },
          frequency: 'months',
          numberOfOccurrences: 1,
          reservations: [],
        };
        const actual = reducer(state, changeNumberOfOccurrences(30));
        expect(actual.numberOfOccurrences).to.equal(24);
        expect(actual.lastTime).to.equal('2019-04-18');
        expect(actual.reservations).to.have.length(24);
      });

      describe('changeLastTime', () => {
        const changeLastTime = recurringReservations.changeLastTime;

        test('changes lastTime to action.payload', () => {
          const lastTime = '2017-04-18';
          const state = {
            ...initialState,
            lastTime,
          };
          const actual = reducer(state, changeLastTime(lastTime));
          expect(actual.lastTime).to.deep.equal(lastTime);
        });

        test('updates numberOfOccurrences', () => {
          const baseTime = {
            begin: '2017-04-18T15:00:00.000Z',
            end: '2017-04-18T16:00:00.000Z',
          };
          const lastTime = '2017-04-20';
          const state = {
            baseTime,
            frequency: 'days',
            numberOfOccurrences: 1,
            lastTime: null,
          };
          const actual = reducer(state, changeLastTime(lastTime));
          expect(actual.numberOfOccurrences).to.equal(2);
        });

        test('rounds down the numberOfOccurrences', () => {
          const baseTime = {
            begin: '2017-04-18T15:00:00.000Z',
            end: '2017-04-18T16:00:00.000Z',
          };
          const lastTime = '2017-04-30';
          const state = {
            baseTime,
            frequency: 'weeks',
            numberOfOccurrences: 1,
            lastTime: null,
          };
          const actual = reducer(state, changeLastTime(lastTime));
          expect(actual.numberOfOccurrences).to.equal(1);
        });

        test('has a maximum of 2 years', () => {
          const baseTime = {
            begin: '2017-04-18T15:00:00.000Z',
            end: '2017-04-18T16:00:00.000Z',
          };
          const lastTime = '2030-04-30';
          const state = {
            baseTime,
            frequency: 'months',
            numberOfOccurrences: 1,
            lastTime: null,
          };
          const actual = reducer(state, changeLastTime(lastTime));
          expect(actual.numberOfOccurrences).to.equal(24);
          expect(actual.lastTime).to.equal('2019-04-18');
          expect(actual.reservations).to.have.length(24);
        });
      });

      describe('removeReservation', () => {
        const removeReservation = recurringReservations.removeReservation;
        const reservations = [
          {
            begin: '2017-04-18T15:00:00.000Z',
            end: '2017-04-18T16:00:00.000Z',
          },
          {
            begin: '2017-04-19T15:00:00.000Z',
            end: '2017-04-19T16:00:00.000Z',
          },
        ];

        test('removes reservation with same begin than payload', () => {
          const state = {
            ...initialState,
            reservations,
          };
          const actual = reducer(state, removeReservation('2017-04-18T15:00:00.000Z'));
          expect(actual.reservations).to.deep.equal([{
            begin: '2017-04-19T15:00:00.000Z',
            end: '2017-04-19T16:00:00.000Z',
          }]);
        });

        test(
          'does not change reservations if begin time is not in reservations',
          () => {
            const state = {
              ...initialState,
              reservations,
            };
            const actual = reducer(state, removeReservation('2017-04-17T15:00:00.000Z'));
            expect(actual.reservations).to.deep.equal(reservations);
          }
        );
      });

      describe('UI.CLOSE_MODAL', () => {
        test('resets state if closed modal is RESERVATION_SUCCESS modal', () => {
          const state = {
            baseTime: { begin: '', end: '' },
            frequency: 'days',
            numberOfOccurrences: 12,
            lastTime: '2017-04-18',
          };
          const actual = reducer(state, closeReservationSuccessModal());
          expect(actual).to.deep.equal(initialState);
        });

        test('resets state if closed modal is RESERVATION_CONFIRM modal', () => {
          const state = {
            baseTime: { begin: '', end: '' },
            frequency: 'days',
            numberOfOccurrences: 12,
            lastTime: '2017-04-18',
          };
          const actual = reducer(state, closeConfirmReservationModal());
          expect(actual).to.deep.equal(initialState);
        });

        test('does not affect state if closed modal is any other modal', () => {
          const state = {
            baseTime: { begin: '', end: '' },
            frequency: 'days',
            numberOfOccurrences: 12,
            lastTime: '2017-04-18',
          };
          const actual = reducer(state, closeReservationCommentModal());
          expect(actual).to.deep.equal(state);
        });
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

    test('returns an empty array if baseTime is not set', () => {
      const reservations = getReservations({ baseTime: null, frequency: 'days' });
      expect(reservations).to.deep.equal([]);
    });

    test('returns an empty array if frequency is not set', () => {
      const reservations = getReservations({ baseTime: { foo: 'bar' }, frequency: '' });
      expect(reservations).to.deep.equal([]);
    });

    test('populates reservations correctly when frequency is "days"', () => {
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

    test('populates reservations correctly when frequency is "weeks"', () => {
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

    test('populates reservations correctly when frequency is "months"', () => {
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
      test('returns whole recurringReservations state', () => {
        const state = {
          recurringReservations: { foo: 'bar' },
        };
        expect(recurringReservations.select(state)).to.deep.equal(state.recurringReservations);
      });
    });

    describe('selectBaseTime', () => {
      test('returns recurringReservations.baseTime', () => {
        const state = {
          recurringReservations: { baseTime: { begin: '', end: '' } },
        };
        expect(recurringReservations.selectBaseTime(state)).to.deep.equal(
          state.recurringReservations.baseTime
        );
      });
    });

    describe('selectFrequency', () => {
      test('returns recurringReservations.frequency', () => {
        const state = {
          recurringReservations: { frequency: 'days' },
        };
        expect(recurringReservations.selectFrequency(state)).to.equal(
          state.recurringReservations.frequency
        );
      });
    });

    describe('selectNumberOfOccurrences', () => {
      test('returns recurringReservations.numberOfOccurrences', () => {
        const state = {
          recurringReservations: { numberOfOccurrences: 12 },
        };
        expect(recurringReservations.selectNumberOfOccurrences(state)).to.equal(
          state.recurringReservations.numberOfOccurrences
        );
      });
    });

    describe('selectReservations', () => {
      test('returns recurringReservations.reservations', () => {
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
