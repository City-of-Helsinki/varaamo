import { expect } from 'chai';

import { getDefaultRouterProps, getState } from 'utils/testUtils';
import searchResultsSelector from './searchResultsSelector';

describe('state/selectors/searchControlsSelector', () => {
  function getSelected(extraState) {
    const state = getState(extraState);
    const props = getDefaultRouterProps();
    return searchResultsSelector(state, props);
  }

  it('returns date', () => {
    expect(getSelected().date).to.exist;
  });
});
