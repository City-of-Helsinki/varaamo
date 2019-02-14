import { expect } from 'chai';
import simple from 'simple-mock';
import * as reduxActions from 'redux-actions';
import { updateRoute } from 'actions/routeActions';

describe('Actions: resourceActions', () => {
  describe('updateRoute', () => {
    beforeEach(() => {
      simple.mock(reduxActions, 'createAction');
    });

    afterEach(() => {
      simple.restore();
    });

    it('calls createAction with a string containing the component name that is provided', () => {
      updateRoute('homepage');

      expect(reduxActions.createAction.calls[0].arg).to.equal('ENTER_OR_CHANGE_HOMEPAGE_PAGE');
    });
  });
});
