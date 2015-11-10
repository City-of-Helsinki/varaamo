import { expect } from 'chai';

import searchPageSelector from 'selectors/containers/searchPageSelector';
import { getInitialState } from 'utils/TestUtils';

describe('Selector: searchPageSelector', () => {
  const state = getInitialState();
  const selected = searchPageSelector(state);

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
