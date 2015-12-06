import { expect } from 'chai';

import searchControlsSelector from 'selectors/containers/searchControlsSelector';
import { getDefaultRouterProps, getInitialState } from 'utils/TestUtils';

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

  it('should return typeaheadOptions', () => {
    expect(selected.typeaheadOptions).to.exist;
  });

  it('should return urlSearchFilters', () => {
    expect(selected.urlSearchFilters).to.exist;
  });
});
