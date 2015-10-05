import { expect } from 'chai';

import Immutable from 'seamless-immutable';

import Resource from 'fixtures/Resource';
import { searchPageSelectors } from 'selectors/searchPageSelectors';

describe('Selectors: searchPageSelectors', () => {
  const resources = [
    Resource.build(),
    Resource.build(),
  ];
  const state = {
    search: Immutable({
      category: 'some-category',
      searchResults: {
        ids: [resources[0].id, resources[1].id],
        isFetching: true,
      },
    }),
    resources: Immutable({
      [resources[0].id]: resources[0],
      [resources[1].id]: resources[1],
    }),
  };

  describe('selected values', () => {
    it('should return category from the state', () => {
      const selected = searchPageSelectors(state);
      const expected = state.search.category;

      expect(selected.category).to.equal(expected);
    });

    it('should return isFetchingSearchResults from the state', () => {
      const selected = searchPageSelectors(state);
      const expected = state.search.searchResults.isFetching;

      expect(selected.isFetchingSearchResults).to.equal(expected);
    });

    it('should return resources corresponding to searchResults.ids as results', () => {
      const selected = searchPageSelectors(state);
      const expected = [resources[0], resources[1]];

      expect(selected.results).to.deep.equal(expected);
    });
  });
});
