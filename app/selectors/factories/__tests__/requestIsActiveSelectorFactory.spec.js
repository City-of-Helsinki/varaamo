import { expect } from 'chai';

import Immutable from 'seamless-immutable';

import requestIsActiveSelectorFactory from 'selectors/factories/requestIsActiveSelectorFactory';

function getState(activeRequests) {
  return {
    api: Immutable({
      activeRequests,
    }),
  };
}

describe('Selector factory: requestIsActiveSelectorFactory', () => {
  it('should return a function', () => {
    expect(typeof requestIsActiveSelectorFactory()).to.equal('function');
  });

  describe('the returned function', () => {
    const requestActionType = 'SOME_GET_REQUEST';

    it('should return true if given request is in activeRequests', () => {
      const selector = requestIsActiveSelectorFactory(requestActionType);
      const state = getState([requestActionType]);

      expect(selector(state)).to.equal(true);
    });

    it('should return false if given request is not in open activeRequests', () => {
      const selector = requestIsActiveSelectorFactory(requestActionType);
      const state = getState([]);

      expect(selector(state)).to.equal(false);
    });
  });
});
