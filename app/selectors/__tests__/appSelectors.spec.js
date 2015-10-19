import { expect } from 'chai';

import Immutable from 'seamless-immutable';

import User from 'fixtures/User';
import { appSelectors } from 'selectors/appSelectors';

describe('Selectors: appSelectors', () => {
  let state;
  let user;

  beforeEach(() => {
    user = User.build();

    state = {
      auth: Immutable({
        userId: user.id,
      }),
      data: Immutable({
        users: {
          [user.id]: user,
        },
      }),
    };
  });

  it('should return user corresponding to the auth.userId', () => {
    const selected = appSelectors(state);

    expect(selected.user).to.deep.equal(user);
  });

  it('should return an empty object if user is not logged in', () => {
    state.auth.userId = null;
    const selected = appSelectors(state);

    expect(selected.user).to.deep.equal({});
  });
});
