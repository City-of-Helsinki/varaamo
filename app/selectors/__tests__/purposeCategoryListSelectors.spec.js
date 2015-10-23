import { expect } from 'chai';

import Immutable from 'seamless-immutable';

import types from 'constants/ActionTypes';
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

  describe('isFetchingPurposes', () => {
    it('should return true if PURPOSES_GET_REQUEST is in activeRequests', () => {
      state.api.activeRequests = [types.API.PURPOSES_GET_REQUEST];
      const selected = purposeCategoryListSelectors(state);

      expect(selected.isFetchingPurposes).to.equal(true);
    });

    it('should return false if PURPOSES_GET_REQUEST is not in activeRequests', () => {
      const selected = purposeCategoryListSelectors(state);

      expect(selected.isFetchingPurposes).to.equal(false);
    });
  });

  it('should return purposeCategories', () => {
    const selected = purposeCategoryListSelectors(state);

    expect(selected.purposeCategories).to.exist;
  });
});
