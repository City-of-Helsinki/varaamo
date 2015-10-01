import { expect } from 'chai';

import _ from 'lodash';
import Immutable from 'seamless-immutable';

import { searchPageSelectors } from 'selectors/searchPageSelectors';

describe('Selectors: searchPageSelectors', () => {
  const state = {
    search: Immutable({
      category: 'some-category',
      searchResults: {
        ids: ['r-1', 'r-2'],
        isFetching: true,
      },
    }),
    resources: Immutable({
      'r-1': { id: 'r-1', name: 'Some resource' },
      'r-2': { id: 'r-2', name: 'Other resource' },
    }),
  };

  describe('selected values', () => {
    it('should return category from the state', () => {
      const selected = searchPageSelectors(state);

      expect(selected.category).to.equal('some-category');
    });

    it('should return isFetchingSearchResults from the state', () => {
      const selected = searchPageSelectors(state);
      const expected = state.search.searchResults.isFetching;

      expect(selected.isFetchingSearchResults).to.equal(expected);
    });

    it('should return resources corresponding to searchResults.ids as results', () => {
      const selected = searchPageSelectors(state);
      const expected = _.values(state.resources);

      expect(selected.results).to.deep.equal(expected);
    });
  });
});
