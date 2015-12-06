import { expect } from 'chai';

import searchPageSelector from 'selectors/containers/searchPageSelector';
import { getDefaultRouterProps, getInitialState } from 'utils/TestUtils';

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

  it('should return routing.path as url from the state', () => {
    const expected = state.routing.path;

    expect(selected.url).to.equal(expected);
  });
});
