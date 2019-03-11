import constants from 'constants/AppConstants';

import React from 'react';
import Alert from 'react-bootstrap/lib/Alert';
import simple from 'simple-mock';

import { shallowWithIntl } from 'utils/testUtils';
import TestSiteMessage from './TestSiteMessage';

describe('shared/test-site-message/TestSiteMessage', () => {
  function getWrapper() {
    return shallowWithIntl(<TestSiteMessage />);
  }

  describe('if SETTINGS.SHOW_TEST_SITE_MESSAGE is true', () => {
    beforeAll(() => {
      simple.mock(constants, 'SHOW_TEST_SITE_MESSAGE').returnWith(true);
    });

    afterAll(() => {
      simple.restore();
    });

    test('renders an Alert', () => {
      const alert = getWrapper().find(Alert);
      expect(alert).toHaveLength(1);
    });
  });

  describe('if SETTINGS.SHOW_TEST_SITE_MESSAGE is not true', () => {
    test('renders an empty span', () => {
      expect(getWrapper().equals(<span />)).toBe(true);
    });
  });
});
