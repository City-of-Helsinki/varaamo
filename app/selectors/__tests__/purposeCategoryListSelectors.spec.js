import { expect } from 'chai';

import Immutable from 'seamless-immutable';

import { purposeCategoryListSelectors } from 'selectors/purposeCategoryListSelectors';

describe('Selectors: purposeCategoryListSelectors', () => {
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
    const selected = purposeCategoryListSelectors(state);

    expect(selected.isFetchingPurposes).to.exist;
  });

  it('should return purposeCategories', () => {
    const selected = purposeCategoryListSelectors(state);

    expect(selected.purposeCategories).to.exist;
  });
});
