import Immutable from 'seamless-immutable';

import requestIsActiveSelectorFactory from '../requestIsActiveSelectorFactory';

function getState(activeRequests) {
  return {
    api: Immutable({
      activeRequests,
    }),
  };
}

describe('Selector factory: requestIsActiveSelectorFactory', () => {
  test('returns a function', () => {
    expect(typeof requestIsActiveSelectorFactory()).toBe('function');
  });

  describe('the returned function', () => {
    const requestActionType = 'SOME_GET_REQUEST';

    test('returns true if given request is in activeRequests with count > 0', () => {
      const selector = requestIsActiveSelectorFactory(requestActionType);
      const state = getState({ [requestActionType]: 1 });

      expect(selector(state)).toBe(true);
    });

    test('returns false if given request is in activeRequests with count 0', () => {
      const selector = requestIsActiveSelectorFactory(requestActionType);
      const state = getState({ [requestActionType]: 0 });

      expect(selector(state)).toBe(false);
    });

    test('returns false if given request is not in activeRequests', () => {
      const selector = requestIsActiveSelectorFactory(requestActionType);
      const state = getState({});

      expect(selector(state)).toBe(false);
    });
  });
});
