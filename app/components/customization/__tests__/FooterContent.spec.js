import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import simple from 'simple-mock';
import { Link } from 'react-router';

import FeedbackLink from 'components/customization/FeedbackLink';
import FooterContent from 'components/customization/FooterContent';
import * as customizationUtils from 'utils/customizationUtils';

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

    it('should contain a link to about page', () => {
      const link = content.find(Link).filter('.about-link');
      expect(link).to.have.length(1);
      expect(link.prop('to')).to.equal('/about');
      expect(link.children().text()).to.equal('Lisätietoa palvelusta');
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

    it('should contain a link to about page', () => {
      const link = content.find(Link).filter('.about-link');
      expect(link).to.have.length(1);
      expect(link.prop('to')).to.equal('/about');
      expect(link.children().text()).to.equal('Lisätietoa palvelusta');
    });
  });
});
