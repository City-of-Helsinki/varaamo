import { expect } from 'chai';

import Immutable from 'seamless-immutable';

import types from 'constants/ActionTypes';
import { searchControlsSelectors } from 'selectors/searchControlsSelectors';

describe('Selectors: searchControlsSelectors', () => {
  let state;

  beforeEach(() => {
    state = {
      api: Immutable({
        activeRequests: [],
      }),
      data: Immutable({
        purposes: {},
      }),
      ui: Immutable({
        search: {
          filters: {
            date: '2015-10-10',
            purpose: 'some-purpose',
          },
        },
      }),
    };
  });

  it('should return filters', () => {
    const selected = searchControlsSelectors(state);

    expect(selected.filters).to.exist;
  });

  describe('isFetchingPurposes', () => {
    it('should return true if PURPOSES_GET_REQUEST is in activeRequests', () => {
      state.api.activeRequests = [types.API.PURPOSES_GET_REQUEST];
      const selected = searchControlsSelectors(state);

      expect(selected.isFetchingPurposes).to.equal(true);
    });

    it('should return false if PURPOSES_GET_REQUEST is not in activeRequests', () => {
      const selected = searchControlsSelectors(state);

      expect(selected.isFetchingPurposes).to.equal(false);
    });
  });

  it('should return purposeOptions', () => {
    const selected = searchControlsSelectors(state);

    expect(selected.purposeOptions).to.exist;
  });
});
