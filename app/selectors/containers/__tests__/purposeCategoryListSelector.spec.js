import { expect } from 'chai';

import Immutable from 'seamless-immutable';

import purposeCategoryListSelector from 'selectors/containers/purposeCategoryListSelector';

describe('Selector: purposeCategoryListSelector', () => {
  let state;

  beforeEach(() => {
    state = {
      api: Immutable({
        activeRequests: [],
      }),
      data: Immutable({
        purposes: {},
      }),
    };
  });

  it('should return isFetchingPurposes', () => {
    const selected = purposeCategoryListSelector(state);

    expect(selected.isFetchingPurposes).to.exist;
  });

  it('should return purposeCategories', () => {
    const selected = purposeCategoryListSelector(state);

    expect(selected.purposeCategories).to.exist;
  });
});
