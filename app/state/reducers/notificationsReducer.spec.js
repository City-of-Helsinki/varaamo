import { expect } from 'chai';

import notificationsReducer from './notificationsReducer';

describe('state/reducers/notificationReducer', () => {
  describe('initial state', () => {
    const initialState = notificationsReducer(undefined, {});

    test('notifications is an empty array', () => {
      expect(initialState).to.deep.equal([]);
    });
  });
});
