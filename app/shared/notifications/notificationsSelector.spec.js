import { expect } from 'chai';

import notificationsSelector from './notificationsSelector';

describe('shared/notifications/notificationsSelector', () => {
  it('returns notifications from state', () => {
    const state = {
      notifications: [
        { text: 'first' },
        { text: 'second' },
      ],
    };
    const selected = notificationsSelector(state);

    expect(selected.notifications).to.deep.equal(state.notifications);
  });

  it('returns only non hidden notifications', () => {
    const state = {
      notifications: [
        { text: 'first', hidden: true },
        { text: 'second', hidden: false },
      ],
    };
    const selected = notificationsSelector(state);
    const expected = [state.notifications[1]];

    expect(selected.notifications).to.deep.equal(expected);
  });
});
