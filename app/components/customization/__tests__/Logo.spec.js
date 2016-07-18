import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import simple from 'simple-mock';

import Logo from 'components/customization/Logo';
import customizationUtils from 'utils/CustomizationUtils';

import espooLogoSrc from 'assets/images/espoo-logo.png';
import helsinkiLogoSrc from 'assets/images/helsinki-coat-of-arms-white.png';

describe('Component: customization/Logo', () => {
  function getWrapper() {
    return shallow(<Logo />);
  }

  describe('When there is no customization in use', () => {
    let logo;

    before(() => {
      logo = getWrapper();
    });

    it('should render logo of Helsinki', () => {
      expect(logo.type()).to.equal('img');
      expect(logo.props().src).to.equal(helsinkiLogoSrc);
    });

    it('should render Helsinki alt text', () => {
      expect(logo.props().alt).to.equal('Helsingin vaakuna');
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

    it('should render logo of Espoo', () => {
      expect(logo.type()).to.equal('img');
      expect(logo.props().src).to.equal(espooLogoSrc);
    });

    it('should render Espoo alt text', () => {
      expect(logo.props().alt).to.equal('Espoon kaupunki');
    });
  });
});
