import chai, {expect} from 'chai';
import chaiImmutable from 'chai-immutable';

import {fromJS} from 'immutable';

import {searchPageSelectors} from 'selectors/searchPageSelectors';

chai.use(chaiImmutable);

describe('Selectors: searchPageSelectors', () => {
  const state = {
    search: fromJS({
      category: 'some-category',
      searchResults: {
        ids: ['r-1', 'r-2'],
        isFetching: true,
      },
    }),
    resources: fromJS({
      'r-1': {id: 'r-1', name: 'Some resource'},
      'r-2': {id: 'r-2', name: 'Other resource'},
    }),
  };

  describe('selected values', () => {
    it('should return category from the state', () => {
      const selected = searchPageSelectors(state);
      expect(selected.category).to.equal('some-category');
    });

    it('should return isFetchingSearchResults from the state', () => {
      const selected = searchPageSelectors(state);
      expect(selected.isFetchingSearchResults).to.be.true;
    });

    it('should return resources corresponding to searchResults.ids as results', () => {
      const selected = searchPageSelectors(state);
      const expected = state.resources.toList();
      expect(selected.results).to.deep.equal(expected);
    });
  });
});
