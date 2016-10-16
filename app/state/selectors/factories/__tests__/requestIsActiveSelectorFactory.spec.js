import { expect } from 'chai';
import Immutable from 'seamless-immutable';

import requestIsActiveSelectorFactory from 'state/selectors/factories/requestIsActiveSelectorFactory';

function getState(activeRequests) {
  return {
    api: Immutable({
      activeRequests,
    }),
  };
}

describe('Selector factory: requestIsActiveSelectorFactory', () => {
  it('returns a function', () => {
    expect(typeof requestIsActiveSelectorFactory()).to.equal('function');
  });

  describe('the returned function', () => {
    const requestActionType = 'SOME_GET_REQUEST';

    it('returns true if given request is in activeRequests with count > 0', () => {
      const selector = requestIsActiveSelectorFactory(requestActionType);
      const state = getState({ [requestActionType]: 1 });

      expect(selector(state)).to.equal(true);
    });

    it('returns false if given request is in activeRequests with count 0', () => {
      const selector = requestIsActiveSelectorFactory(requestActionType);
      const state = getState({ [requestActionType]: 0 });

      expect(selector(state)).to.equal(false);
    });

    it('returns false if given request is not in activeRequests', () => {
      const selector = requestIsActiveSelectorFactory(requestActionType);
      const state = getState({});

      expect(selector(state)).to.equal(false);
    });
  });
});
