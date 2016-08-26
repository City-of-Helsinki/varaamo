import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import simple from 'simple-mock';

import FeedbackLink from 'components/customization/FeedbackLink';
import FooterContent from 'components/customization/FooterContent';
import * as customizationUtils from 'utils/CustomizationUtils';

describe('Component: customization/FooterContent', () => {
  function getWrapper() {
    return shallow(<FooterContent />);
  }

  describe('When there is no customization in use', () => {
    let content;

    before(() => {
      content = getWrapper();
    });

    it('should contain feedback link', () => {
      const feedbackLink = content.find(FeedbackLink);
      expect(feedbackLink.length).to.equal(1);
    });

    it('should render default texts', () => {
      expect(content.find('p').text()).to.not.contain('Espoo');
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

    it('should contain feedback link', () => {
      const feedbackLink = content.find(FeedbackLink);
      expect(feedbackLink.length).to.equal(1);
    });

    it('should render texts for Espoo', () => {
      expect(content.find('p').text()).to.contain('Espoo');
    });
  });
});
