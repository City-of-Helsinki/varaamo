import constants from 'constants/AppConstants';

import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import simple from 'simple-mock';

import * as customizationUtils from 'utils/customizationUtils';
import FeedbackLink from './FeedbackLink';

describe('shared/feedback-link/FeedbackLink', () => {
  const linkChildren = <span>Some text</span>;

  function getWrapper() {
    return shallow(<FeedbackLink>{linkChildren}</FeedbackLink>);
  }

  describe('When there is no customization in use', () => {
    let link;

    beforeEach(() => {
      link = getWrapper();
    });

    it('renders a link', () => {
      expect(link.type()).to.equal('a');
    });

    it('renders children', () => {
      const wrapper = getWrapper();
      expect(wrapper.children().equals(linkChildren)).to.be.true;
    });

    it('has correct href', () => {
      const expected = `${constants.FEEDBACK_URL}&ref=${window.location.href}`;
      expect(link.props().href).to.equal(expected);
    });
  });

  describe('When Espoo customization is used', () => {
    let link;

    beforeEach(() => {
      simple.mock(customizationUtils, 'getCurrentCustomization').returnWith('ESPOO');
      link = getWrapper();
    });

    afterEach(() => {
      simple.restore();
    });

    it('renders a link', () => {
      expect(link.type()).to.equal('a');
    });

    it('renders children', () => {
      const wrapper = getWrapper();
      expect(wrapper.children().equals(linkChildren)).to.be.true;
    });

    it('has correct href', () => {
      const expected = `${constants.FEEDBACK_URL}&ref=${window.location.href}`;
      expect(link.props().href).to.equal(expected);
    });
  });
});
