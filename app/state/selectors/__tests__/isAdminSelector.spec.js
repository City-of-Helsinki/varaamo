import { expect } from 'chai';
import Immutable from 'seamless-immutable';

import User from 'utils/fixtures/User';
import isAdminSelector from 'state/selectors/isAdminSelector';
import { getInitialState } from 'utils/testUtils';

function getState(user) {
  return {
    auth: Immutable({
      userId: user.id,
      token: 'mock-token',
    }),
    data: Immutable({
      users: { [user.id]: user },
    }),
  };
}

describe('Selector: isAdminSelector', () => {
  it('returns false if user is not logged in', () => {
    const state = getInitialState();
    const actual = isAdminSelector(state);

    expect(actual).to.equal(false);
  });

  it('returns false if user.isStaff is false', () => {
    const user = User.build({ isStaff: false });
    const state = getState(user);
    const actual = isAdminSelector(state);

    expect(actual).to.equal(false);
  });

  it('returns true if user.isStaff is true', () => {
    const user = User.build({ isStaff: true });
    const state = getState(user);
    const actual = isAdminSelector(state);

    expect(actual).to.equal(true);
  });
});
