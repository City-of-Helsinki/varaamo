import notificationsSelector from '../notificationsSelector';

describe('shared/notifications/notificationsSelector', () => {
  test('returns notifications from state', () => {
    const state = {
      notifications: [{ text: 'first' }, { text: 'second' }],
    };
    const selected = notificationsSelector(state);

    expect(selected.notifications).toEqual(state.notifications);
  });

  test('returns only non hidden notifications', () => {
    const state = {
      notifications: [
        { text: 'first', hidden: true },
        { text: 'second', hidden: false },
      ],
    };
    const selected = notificationsSelector(state);
    const expected = [state.notifications[1]];

    expect(selected.notifications).toEqual(expected);
  });
});
