import { expect } from 'chai';

import { getInitialState } from 'utils/TestUtils';
import purposeCategoryListSelector from 'selectors/containers/purposeCategoryListSelector';

describe('Selector: purposeCategoryListSelector', () => {
  const state = getInitialState();
  const selected = purposeCategoryListSelector(state);

  it('should return isFetchingPurposes', () => {
    expect(selected.isFetchingPurposes).to.exist;
  });

  it('should return purposeCategories', () => {
    expect(selected.purposeCategories).to.exist;
  });
});
