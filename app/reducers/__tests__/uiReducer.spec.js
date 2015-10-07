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

      it('results should be an empty array', () => {
        expect(search.results).to.deep.equal([]);
      });
    });
  });
});
