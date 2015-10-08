import { expect } from 'chai';

import { uiReducer as reducer } from 'reducers/uiReducer';

describe('Reducer: uiReducer', () => {
  describe('initial state', () => {
    const initialState = reducer(undefined, {});

    describe('search', () => {
      const search = initialState.search;

      it('should be an object', () => {
        expect(typeof search).to.equal('object');
      });

      describe('filters', () => {
        it('should be an object', () => {
          expect(typeof search.filters).to.equal('object');
        });

        it('purpose should be an empty string', () => {
          expect(search.filters.purpose).to.equal('');
        });
      });

      it('results should be an empty array', () => {
        expect(search.results).to.deep.equal([]);
      });
    });
  });
});
