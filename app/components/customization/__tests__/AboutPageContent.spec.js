import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import simple from 'simple-mock';

import AboutPageContent from 'components/customization/AboutPageContent';
import * as customizationUtils from 'utils/customizationUtils';

describe('Component: customization/AboutPageContent', () => {
  function getWrapper() {
    return shallow(<AboutPageContent />);
  }

  describe('When there is no customization in use', () => {
    let content;

    before(() => {
      content = getWrapper();
    });

    it('should render header for Helsinki', () => {
      const expected = 'Tietoa varaamo.hel.fi –palvelusta';
      expect(content.find('h1').text()).to.contain(expected);
    });
  });

  describe('When Espoo customization is used', () => {
    let content;

    before(() => {
      simple.mock(customizationUtils, 'getCurrentCustomization').returnWith('ESPOO');
      content = getWrapper();
    });

    after(() => {
      simple.restore();
    });

    it('should render header for Espoo', () => {
      const expected = 'Tietoa varaamo.espoo.fi –palvelusta';
      expect(content.find('h1').text()).to.contain(expected);
    });
  });
});
