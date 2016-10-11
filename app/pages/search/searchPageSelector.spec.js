import { expect } from 'chai';

import { getDefaultRouterProps, getState } from 'utils/testUtils';
import searchPageSelector from './searchPageSelector';

describe('pages/search/searchPageSelector', () => {
  const searchResultIds = ['resource-1', 'resourece-2'];
  const state = getState({
    'ui.search.results': searchResultIds,
  });
  const props = getDefaultRouterProps();
  const selected = searchPageSelector(state, props);

  it('returns filters', () => {
    expect(selected.filters).to.exist;
  });

  it('returns isFetchingSearchResults', () => {
    expect(selected.isFetchingSearchResults).to.exist;
  });

  it('returns searchDone', () => {
    expect(selected.searchDone).to.exist;
  });

  it('returns searchResultIds', () => {
    expect(selected.searchResultIds).to.deep.equal(searchResultIds);
  });
});
