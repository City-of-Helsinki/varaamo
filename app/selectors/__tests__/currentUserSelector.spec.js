import { expect } from 'chai';

import indexBy from 'lodash/collection/indexBy';
import Immutable from 'seamless-immutable';

import User from 'fixtures/User';
import currentUserSelector from 'selectors/currentUserSelector';

function getState(users, loggedInUserId) {
  return {
    auth: Immutable({
      userId: loggedInUserId,
      token: 'mock-token',
    }),
    data: Immutable({
      users: indexBy(users, 'id'),
    }),
  };
}

describe('Selector: currentUserSelector', () => {
  const users = [User.build()];

  it('should return user corresponding to the auth.userId', () => {
    const user = users[0];
    const state = getState(users, user.id);
    const selected = currentUserSelector(state);

    expect(selected).to.deep.equal(user);
  });

  it('should return an empty object if user with the given id does not exist', () => {
    const state = getState(users, 'unknown-id');
    const selected = currentUserSelector(state);

    expect(selected).to.deep.equal({});
  });

  it('should return an empty object if user is not logged in', () => {
    const state = getState(users, null);
    const selected = currentUserSelector(state);

    expect(selected).to.deep.equal({});
  });
});
