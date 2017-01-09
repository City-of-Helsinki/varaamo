import { expect } from 'chai';
import React from 'react';
import Alert from 'react-bootstrap/lib/Alert';
import simple from 'simple-mock';

import constants from 'constants/AppConstants';
import { shallowWithIntl } from 'utils/testUtils';
import TestSiteMessage from './TestSiteMessage';

describe('shared/test-site-message/TestSiteMessage', () => {
  function getWrapper() {
    return shallowWithIntl(<TestSiteMessage />);
  }

  describe('if SETTINGS.SHOW_TEST_SITE_MESSAGE is true', () => {
    before(() => {
      simple.mock(constants, 'SHOW_TEST_SITE_MESSAGE').returnWith(true);
    });

    after(() => {
      simple.restore();
    });

    it('renders an Alert', () => {
      const alert = getWrapper().find(Alert);
      expect(alert).to.have.length(1);
    });
  });

  describe('if SETTINGS.SHOW_TEST_SITE_MESSAGE is not true', () => {
    it('renders an empty span', () => {
      expect(getWrapper().equals(<span />)).to.be.true;
    });
  });
});
