import { expect } from 'chai';
import keyBy from 'lodash/keyBy';
import Immutable from 'seamless-immutable';

import User from 'utils/fixtures/User';
import appSelector from './appSelector';

function getState(users, loggedInUserId) {
  return {
    auth: Immutable({
      userId: loggedInUserId,
      token: 'mock-token',
    }),
    data: Immutable({
      users: keyBy(users, 'id'),
    }),
  };
}

describe('pages/appSelector', () => {
  const users = [User.build()];

  it('returns isAdmin', () => {
    const state = getState();
    const selected = appSelector(state);

    expect(selected.isAdmin).to.exist;
  });

  it('returns isLoggedIn', () => {
    const state = getState();
    const selected = appSelector(state);

    expect(selected.isLoggedIn).to.exist;
  });

  it('returns user corresponding to the auth.userId', () => {
    const user = users[0];
    const state = getState(users, user.id);
    const selected = appSelector(state);

    expect(selected.user).to.deep.equal(user);
  });

  it('returns an empty object if user is not logged in', () => {
    const state = getState(users, null);
    const selected = appSelector(state);

    expect(selected.user).to.deep.equal({});
  });

  it('returns userId', () => {
    const user = users[0];
    const state = getState(users, user.id);
    const selected = appSelector(state);

    expect(selected.userId).to.deep.equal(user.id);
  });
});
