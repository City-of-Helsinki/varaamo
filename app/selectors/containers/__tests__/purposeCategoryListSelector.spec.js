import { expect } from 'chai';

import { getDefaultRouterProps, getInitialState } from 'utils/TestUtils';
import purposeCategoryListSelector from 'selectors/containers/purposeCategoryListSelector';

describe('Selector: purposeCategoryListSelector', () => {
  const state = getInitialState();
  const props = getDefaultRouterProps();
  const selected = purposeCategoryListSelector(state, props);

  it('should return isFetchingPurposes', () => {
    expect(selected.isFetchingPurposes).to.exist;
  });

  it('should return purposeCategories', () => {
    expect(selected.purposeCategories).to.exist;
  });
});
