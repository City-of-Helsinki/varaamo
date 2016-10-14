import { expect } from 'chai';

import isLoggedInSelector from 'state/selectors/isLoggedInSelector';

function getState(token = null, userId = null) {
  return {
    auth: {
      token,
      userId,
    },
  };
}

describe('Selector: isLoggedInSelector', () => {
  it('returns false if token is null', () => {
    const state = getState(null, 'u-1');
    const actual = isLoggedInSelector(state);

    expect(actual).to.equal(false);
  });

  it('returns false if userId is null', () => {
    const state = getState('mock-token', null);
    const actual = isLoggedInSelector(state);

    expect(actual).to.equal(false);
  });

  it('returns true if both token and userId are defined', () => {
    const state = getState('mock-token', 'u-1');
    const actual = isLoggedInSelector(state);

    expect(actual).to.equal(true);
  });
});
