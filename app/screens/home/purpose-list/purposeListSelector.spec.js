import { expect } from 'chai';

import { getDefaultRouterProps, getInitialState } from 'utils/TestUtils';
import purposeListSelector from './purposeListSelector';

describe('screens/home/purpose-list/purposeListSelector', () => {
  const state = getInitialState();
  const props = getDefaultRouterProps();
  const selected = purposeListSelector(state, props);

  it('should return isFetchingPurposes', () => {
    expect(selected.isFetchingPurposes).to.exist;
  });

  it('should return purposeCategories', () => {
    expect(selected.purposeCategories).to.exist;
  });
});
