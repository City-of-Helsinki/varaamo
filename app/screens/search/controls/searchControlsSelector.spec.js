import { expect } from 'chai';

import { getDefaultRouterProps, getInitialState } from 'utils/TestUtils';
import searchControlsSelector from './searchControlsSelector';

describe('Selector: searchControlsSelector', () => {
  const state = getInitialState();
  const props = getDefaultRouterProps();
  const selected = searchControlsSelector(state, props);

  it('should return filters', () => {
    expect(selected.filters).to.exist;
  });

  it('should return isFetchingPurposes', () => {
    expect(selected.isFetchingPurposes).to.exist;
  });

  it('should return purposeOptions', () => {
    expect(selected.purposeOptions).to.exist;
  });

  it('should return urlSearchFilters', () => {
    expect(selected.urlSearchFilters).to.exist;
  });
});
