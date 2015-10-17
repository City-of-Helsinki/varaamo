import { expect } from 'chai';

import { uiReducer as reducer } from 'reducers/uiReducer';

describe('Reducer: uiReducer', () => {
  describe('initial state', () => {
    const initialState = reducer(undefined, {});

    describe('modals', () => {
      const modals = initialState.modals;

      it('should be an object', () => {
        expect(typeof modals).to.equal('object');
      });

      it('open should be an empty array', () => {
        expect(modals.open).to.deep.equal([]);
      });
    });

    describe('reservation', () => {
      const reservation = initialState.reservation;

      it('should be an object', () => {
        expect(typeof reservation).to.equal('object');
      });

      it('date should be an empty string', () => {
        expect(reservation.date).to.equal('');
      });

      it('selected should be an empty array', () => {
        expect(reservation.selected).to.deep.equal([]);
      });
    });

    describe('search', () => {
      const search = initialState.search;

      it('should be an object', () => {
        expect(typeof search).to.equal('object');
      });

      describe('filters', () => {
        it('should be an object', () => {
          expect(typeof search.filters).to.equal('object');
        });

        it('date should be an empty string', () => {
          expect(search.filters.date).to.equal('');
        });

        it('purpose should be an empty string', () => {
          expect(search.filters.purpose).to.equal('');
        });

        it('search should be an empty string', () => {
          expect(search.filters.search).to.equal('');
        });
      });

      it('results should be an empty array', () => {
        expect(search.results).to.deep.equal([]);
      });
    });
  });
});
