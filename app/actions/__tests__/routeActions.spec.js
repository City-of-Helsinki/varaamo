import simple from 'simple-mock';
import * as reduxActions from 'redux-actions';

import { updateRoute } from '../routeActions';

describe('Actions: resourceActions', () => {
  describe('updateRoute', () => {
    beforeEach(() => {
      simple.mock(reduxActions, 'createAction');
    });

    afterEach(() => {
      simple.restore();
    });

    test(
      'calls createAction with a string containing the component name that is provided',
      () => {
        updateRoute('homepage');

        expect(reduxActions.createAction.calls[0].arg).toBe('ENTER_OR_CHANGE_HOMEPAGE_PAGE');
      }
    );
  });
});
