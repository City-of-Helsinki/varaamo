import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import { Link } from 'react-router';
import simple from 'simple-mock';

import FeedbackLink from 'shared/feedback-link';
import * as customizationUtils from 'utils/customizationUtils';
import FooterContent from './FooterContent';

describe('shared/footer/FooterContent', () => {
  function getWrapper() {
    return shallow(<FooterContent />);
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

    it('renders default texts', () => {
      expect(content.find('p').text()).to.not.contain('Espoo');
    });

    it('contains a link to about page', () => {
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

    it('contains feedback link', () => {
      const feedbackLink = content.find(FeedbackLink);
      expect(feedbackLink.length).to.equal(1);
    });

    it('renders texts for Espoo', () => {
      expect(content.find('p').text()).to.contain('Espoo');
    });

    it('contains a link to about page', () => {
      const link = content.find(Link).filter('.about-link');
      expect(link).to.have.length(1);
      expect(link.prop('to')).to.equal('/about');
      expect(link.children().text()).to.equal('Lisätietoa palvelusta');
    });
  });
});
