import { expect } from 'chai';

import searchControlsSelector from 'selectors/containers/searchControlsSelector';
import { getInitialState } from 'utils/TestUtils';

describe('Selector: searchControlsSelector', () => {
  const state = getInitialState();
  const selected = searchControlsSelector(state);

  it('should return filters', () => {
    expect(selected.filters).to.exist;
  });

  it('should return isFetchingPurposes', () => {
    expect(selected.isFetchingPurposes).to.exist;
  });

  it('should return purposeOptions', () => {
    expect(selected.purposeOptions).to.exist;
  });
});
