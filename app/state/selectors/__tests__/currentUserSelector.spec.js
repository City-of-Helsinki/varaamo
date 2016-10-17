import { expect } from 'chai';
import keyBy from 'lodash/keyBy';
import Immutable from 'seamless-immutable';

import currentUserSelector from 'state/selectors/currentUserSelector';
import User from 'utils/fixtures/User';

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

describe('Selector: currentUserSelector', () => {
  const users = [User.build()];

  it('returns user corresponding to the auth.userId', () => {
    const user = users[0];
    const state = getState(users, user.id);
    const selected = currentUserSelector(state);

    expect(selected).to.deep.equal(user);
  });

  it('returns an empty object if user with the given id does not exist', () => {
    const state = getState(users, 'unknown-id');
    const selected = currentUserSelector(state);

    expect(selected).to.deep.equal({});
  });

  it('returns an empty object if user is not logged in', () => {
    const state = getState(users, null);
    const selected = currentUserSelector(state);

    expect(selected).to.deep.equal({});
  });
});
