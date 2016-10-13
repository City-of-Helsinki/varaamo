import { expect } from 'chai';
import simple from 'simple-mock';

import AppConstants from 'constants/AppConstants';
import trackingMiddleware, { track } from './tracking';

describe('state/middleware/tracking', () => {
  let dispatch;
  let middleware;
  let action;
  const timeoutFunc = window.setTimeout;
  beforeEach(() => {
    simple.mock(window, 'setTimeout').returnWith(null);
    dispatch = simple.mock();
    middleware = trackingMiddleware()(dispatch);
    simple.mock(AppConstants, 'TRACKING');
  });

  afterEach(() => {
    simple.restore();
  });

  describe('on trackable action', () => {
    beforeEach(() => {
      action = {
        meta: {
          track: {
            event: 'trackEvent',
            args: ['argument1', 'argument2'],
          },
        },
        type: 'SOME_ACTION',
      };
      middleware(action);
    });

    it('calls setTimeout', () => {
      expect(window.setTimeout.callCount).to.equal(1);
      const args = window.setTimeout.lastCall.args;
      expect(args).to.have.length(2);
      expect(typeof args[0]).to.equal('function');
      expect(args[1]).to.equal(0);
    });

    it('dispatches action', () => {
      expect(dispatch.callCount).to.equal(1);
      expect(dispatch.lastCall.args).to.deep.equal([action]);
    });
  });

  describe('on untrackable action', () => {
    beforeEach(() => {
      action = { type: 'SOME_ACTION' };
      middleware(action);
    });

    it('does not call setTimeout', () => {
      expect(window.setTimeout.callCount).to.equal(0);
    });

    it('dispatches action', () => {
      expect(dispatch.callCount).to.equal(1);
      expect(dispatch.lastCall.args).to.deep.equal([action]);
    });
  });

  describe('track', () => {
    let push;
    let trackData;
    beforeEach(() => {
      push = simple.mock();
      trackData = {
        event: 'trackEvent',
        args: ['argument1', 'argument2'],
      };
      window._paq = { push };
    });

    afterEach(() => {
      window._paq = undefined;
      push.reset();
    });

    it('pushes track with correct data', () => {
      track(trackData);
      expect(push.callCount).to.equal(1);
      expect(push.lastCall.args[0]).to.deep.equal(['trackEvent', 'argument1', 'argument2']);
    });

    it('waits for _paq to be defined', (done) => {
      track(trackData);
      simple.mock(window, '_paq').returnWith({ push });
      timeoutFunc(
        () => {
          expect(push.callCount).to.equal(1);
          done();
        },
        500
      );
    });
  });
});
