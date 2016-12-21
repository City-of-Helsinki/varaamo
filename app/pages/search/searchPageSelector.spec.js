import { expect } from 'chai';

import { getDefaultRouterProps, getState } from 'utils/testUtils';
import searchPageSelector from './searchPageSelector';

describe('pages/search/searchPageSelector', () => {
  const searchResultIds = ['resource-1', 'resourece-2'];

  function getSelected() {
    const state = getState({
      'ui.search.results': searchResultIds,
    });
    const props = getDefaultRouterProps();
    return searchPageSelector(state, props);
  }

  it('returns filters', () => {
    expect(getSelected().filters).to.exist;
  });

  it('returns isFetchingSearchResults', () => {
    expect(getSelected().isFetchingSearchResults).to.exist;
  });

  it('returns searchDone', () => {
    expect(getSelected().searchDone).to.exist;
  });

  it('returns searchResultIds', () => {
    expect(getSelected().searchResultIds).to.deep.equal(searchResultIds);
  });
});
