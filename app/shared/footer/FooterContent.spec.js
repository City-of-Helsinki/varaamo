import { expect } from 'chai';
import React from 'react';
// import { Link } from 'react-router';
import simple from 'simple-mock';

import FeedbackLink from 'shared/feedback-link';
import * as customizationUtils from 'utils/customizationUtils';
import { shallowWithIntl } from 'utils/testUtils';
import FooterContent from './FooterContent';

describe('shared/footer/FooterContent', () => {
  function getWrapper(props) {
    return shallowWithIntl(<FooterContent {...props} />);
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

    // it('Logo link has correct onClick prop', () => {
    //   const onLinkClick = () => {};
    //   const link = getWrapper({ onLinkClick }).find(Link).filter('.brand-link');
    //   expect(link.prop('onClick')).to.equal(onLinkClick);
    // });
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

    // it('Logo link has correct onClick prop', () => {
    //   const onLinkClick = () => {};
    //   const link = getWrapper({ onLinkClick }).find(Link).filter('.brand-link');
    //   expect(link.prop('onClick')).to.equal(onLinkClick);
    // });
  });

  describe('When Vantaa customization is used', () => {
    let content;

    before(() => {
      simple.mock(customizationUtils, 'getCurrentCustomization').returnWith('VANTAA');
      content = getWrapper();
    });

    after(() => {
      simple.restore();
    });

    it('contains feedback link', () => {
      const feedbackLink = content.find(FeedbackLink);
      expect(feedbackLink.length).to.equal(1);
    });

    it('renders texts for Vantaa', () => {
      const texts = content.find('p').text();
      expect(texts).to.contain('Footer.vantaaText');
    });

    // it('Logo link has correct onClick prop', () => {
    //   const onLinkClick = () => {};
    //   const link = getWrapper({ onLinkClick }).find(Link).filter('.brand-link');
    //   expect(link.prop('onClick')).to.equal(onLinkClick);
    // });
  });
});
