import { expect } from 'chai';
import React from 'react';
import simple from 'simple-mock';

import * as customizationUtils from 'utils/customizationUtils';
import { shallowWithIntl } from 'utils/testUtils';
import AboutPageContent from './AboutPageContent';

describe('Component: customization/AboutPageContent', () => {
  function getWrapper() {
    return shallowWithIntl(<AboutPageContent />);
  }

  describe('When there is no customization in use', () => {
    let content;

    beforeAll(() => {
      content = getWrapper();
    });

    test('renders header for Helsinki', () => {
      expect(content.find('h1').text()).to.contain('AboutPageContent.defaultHeader');
    });
  });

  describe('When Espoo customization is used', () => {
    let content;

    beforeAll(() => {
      simple.mock(customizationUtils, 'getCurrentCustomization').returnWith('ESPOO');
      content = getWrapper();
    });

    afterAll(() => {
      simple.restore();
    });

    test('renders header for Espoo', () => {
      expect(content.find('h1').text()).to.contain('AboutPageContent.espooHeader');
    });
  });

  describe('When Vantaa customization is used', () => {
    let content;

    beforeAll(() => {
      simple.mock(customizationUtils, 'getCurrentCustomization').returnWith('VANTAA');
      content = getWrapper();
    });

    afterAll(() => {
      simple.restore();
    });

    test('renders header for Vantaa', () => {
      expect(content.find('h1').text()).to.contain('AboutPageContent.vantaaHeader');
    });
  });
});
