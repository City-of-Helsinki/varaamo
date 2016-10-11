import { expect } from 'chai';

import { getDefaultRouterProps, getInitialState } from 'utils/testUtils';
import purposeListSelector from './purposeListSelector';

describe('pages/home/purpose-list/purposeListSelector', () => {
  const state = getInitialState();
  const props = getDefaultRouterProps();
  const selected = purposeListSelector(state, props);

  it('returns isFetchingPurposes', () => {
    expect(selected.isFetchingPurposes).to.exist;
  });

  describe('purposes', () => {
    expect(selected.purposes).to.exist;
  });
});
