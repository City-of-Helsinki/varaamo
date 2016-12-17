import { expect } from 'chai';
import React from 'react';
import { Link } from 'react-router';
import simple from 'simple-mock';

import FeedbackLink from 'shared/feedback-link';
import * as customizationUtils from 'utils/customizationUtils';
import { shallowWithIntl } from 'utils/testUtils';
import FooterContent from './FooterContent';

describe('shared/footer/FooterContent', () => {
  function getWrapper() {
    return shallowWithIntl(<FooterContent />);
  }

  describe('When there is no customization in use', () => {
    let content;

    before(() => {
      content = getWrapper();
    });

    it('contains feedback link', () => {
      const feedbackLink = content.find(FeedbackLink);
      expect(feedbackLink.length).to.equal(1);
    });

    it('renders texts for Helsinki', () => {
      const texts = content.find('p').text();
      expect(texts).to.contain('Footer.helsinkiText');
    });

    it('contains a link to about page', () => {
      const link = content.find(Link).filter('.about-link');
      expect(link).to.have.length(1);
      expect(link.prop('to')).to.equal('/about');
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

    it('contains feedback link', () => {
      const feedbackLink = content.find(FeedbackLink);
      expect(feedbackLink.length).to.equal(1);
    });

    it('renders texts for Espoo', () => {
      const texts = content.find('p').text();
      expect(texts).to.contain('Footer.espooText');
    });

    it('contains a link to about page', () => {
      const link = content.find(Link).filter('.about-link');
      expect(link).to.have.length(1);
      expect(link.prop('to')).to.equal('/about');
    });
  });
});
