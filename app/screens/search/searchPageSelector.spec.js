import { expect } from 'chai';

import { getDefaultRouterProps, getInitialState } from 'utils/TestUtils';
import searchPageSelector from './searchPageSelector';

describe('Selector: searchPageSelector', () => {
  const state = getInitialState();
  const props = getDefaultRouterProps();
  const selected = searchPageSelector(state, props);

  it('should return filters', () => {
    expect(selected.filters).to.exist;
  });

  it('should return isFetchingSearchResults', () => {
    expect(selected.isFetchingSearchResults).to.exist;
  });

  it('should return results', () => {
    expect(selected.results).to.exist;
  });

  it('should return searchDone', () => {
    expect(selected.searchDone).to.exist;
  });

  it('should return units from the state', () => {
    const expected = state.data.units;

    expect(selected.units).to.deep.equal(expected);
  });
});
