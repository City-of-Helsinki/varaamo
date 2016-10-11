import { expect } from 'chai';

import { getDefaultRouterProps, getInitialState } from 'utils/testUtils';
import searchControlsSelector from './searchControlsSelector';

describe('Selector: searchControlsSelector', () => {
  const state = getInitialState();
  const props = getDefaultRouterProps();
  const selected = searchControlsSelector(state, props);

  it('returns filters', () => {
    expect(selected.filters).to.exist;
  });

  it('returns isFetchingPurposes', () => {
    expect(selected.isFetchingPurposes).to.exist;
  });

  it('returns purposeOptions', () => {
    expect(selected.purposeOptions).to.exist;
  });

  it('returns urlSearchFilters', () => {
    expect(selected.urlSearchFilters).to.exist;
  });
});
