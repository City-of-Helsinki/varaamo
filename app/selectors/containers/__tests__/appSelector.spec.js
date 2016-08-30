import { expect } from 'chai';

import keyBy from 'lodash/keyBy';
import Immutable from 'seamless-immutable';

import User from 'fixtures/User';
import appSelector from 'selectors/containers/appSelector';

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

describe('Selector: appSelector', () => {
  const users = [User.build()];

  it('should return isLoggedIn', () => {
    const state = getState();
    const selected = appSelector(state);

    expect(selected.isLoggedIn).to.exist;
  });

  it('should return user corresponding to the auth.userId', () => {
    const user = users[0];
    const state = getState(users, user.id);
    const selected = appSelector(state);

    expect(selected.user).to.deep.equal(user);
  });

  it('should return an empty object if user is not logged in', () => {
    const state = getState(users, null);
    const selected = appSelector(state);

    expect(selected.user).to.deep.equal({});
  });

  it('should return userId', () => {
    const user = users[0];
    const state = getState(users, user.id);
    const selected = appSelector(state);

    expect(selected.userId).to.deep.equal(user.id);
  });
});
