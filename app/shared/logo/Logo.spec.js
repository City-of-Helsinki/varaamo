import { expect } from 'chai';
import React from 'react';
import simple from 'simple-mock';

import * as customizationUtils from 'utils/customizationUtils';
import { shallowWithIntl } from 'utils/testUtils';
import Logo from './Logo';
import espooLogoSrc from './espoo-logo.png';
import helsinkiLogoSrc from './helsinki-coat-of-arms-white.png';

describe('shared/logo/Logo', () => {
  function getWrapper() {
    return shallowWithIntl(<Logo />);
  }

  describe('When there is no customization in use', () => {
    let logo;

    before(() => {
      logo = getWrapper();
    });

    it('renders logo of Helsinki', () => {
      expect(logo.type()).to.equal('img');
      expect(logo.props().src).to.equal(helsinkiLogoSrc);
    });

    it('renders Helsinki alt text', () => {
      expect(logo.props().alt).to.equal('Logo.helsinkiAlt');
    });
  });

  describe('When Espoo customization is used', () => {
    let logo;

    before(() => {
      simple.mock(customizationUtils, 'getCurrentCustomization').returnWith('ESPOO');
      logo = getWrapper();
    });

    after(() => {
      simple.restore();
    });

    it('renders logo of Espoo', () => {
      expect(logo.type()).to.equal('img');
      expect(logo.props().src).to.equal(espooLogoSrc);
    });

    it('renders Espoo alt text', () => {
      expect(logo.props().alt).to.equal('Logo.espooAlt');
    });
  });
});
