import simple from 'simple-mock';

import AppConstants from '../../../constants/AppConstants';
import trackingMiddleware, { track } from '../tracking';

describe('store/middleware/tracking', () => {
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

    test('calls setTimeout', () => {
      expect(window.setTimeout.callCount).toBe(1);
      const { args } = window.setTimeout.lastCall;
      expect(args).toHaveLength(2);
      expect(typeof args[0]).toBe('function');
      expect(args[1]).toBe(0);
    });

    test('dispatches action', () => {
      expect(dispatch.callCount).toBe(1);
      expect(dispatch.lastCall.args).toEqual([action]);
    });
  });

  describe('on untrackable action', () => {
    beforeEach(() => {
      action = { type: 'SOME_ACTION' };
      middleware(action);
    });

    test('does not call setTimeout', () => {
      expect(window.setTimeout.callCount).toBe(0);
    });

    test('dispatches action', () => {
      expect(dispatch.callCount).toBe(1);
      expect(dispatch.lastCall.args).toEqual([action]);
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

    test('pushes track with correct data', () => {
      track(trackData);
      expect(push.callCount).toBe(1);
      expect(push.lastCall.args[0]).toEqual([
        'trackEvent',
        'argument1',
        'argument2',
      ]);
    });

    test('waits for _paq to be defined', (done) => {
      track(trackData);
      simple.mock(window, '_paq').returnWith({ push });
      timeoutFunc(() => {
        expect(push.callCount).toBe(1);
        done();
      }, 500);
    });
  });
});
