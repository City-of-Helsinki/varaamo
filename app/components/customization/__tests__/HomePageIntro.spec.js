import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import simple from 'simple-mock';

import HomePageIntro from 'components/customization/HomePageIntro';
import * as customizationUtils from 'utils/CustomizationUtils';

describe('Component: customization/HomePageIntro', () => {
  function getWrapper() {
    return shallow(<HomePageIntro />);
  }

  describe('When there is no customization in use', () => {
    let intro;

    before(() => {
      intro = getWrapper();
    });

    it('should render default texts', () => {
      const text = intro.find('p').text();
      expect(text).to.not.contain('Espoo');
    });
  });

  describe('When Espoo customization is used', () => {
    let intro;

    before(() => {
      simple.mock(customizationUtils, 'getCurrentCustomization').returnWith('ESPOO');
      intro = getWrapper();
    });

    after(() => {
      simple.restore();
    });

    it('should render texts for Espoo', () => {
      const text = intro.find('p').text();
      expect(text).to.contain('Espoo');
    });
  });
});
