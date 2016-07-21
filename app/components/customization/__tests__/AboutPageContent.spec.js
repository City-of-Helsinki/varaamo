import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import simple from 'simple-mock';

import AboutPageContent from 'components/customization/AboutPageContent';
import customizationUtils from 'utils/CustomizationUtils';

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
      const expectedHeader = 'Tietoa varaamo.hel.fi –palvelusta';
      expect(content.find('h1').text()).to.contain(expectedHeader);
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

    it('should render content for Espoo', () => {
      const expected = 'Placeholder text for Espoo about page.';
      expect(content.text()).to.equal(expected);
    });
  });
});
