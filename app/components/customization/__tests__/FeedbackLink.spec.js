import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import simple from 'simple-mock';

import FeedbackLink from 'components/customization/FeedbackLink';
import constants from 'constants/AppConstants';
import * as customizationUtils from 'utils/CustomizationUtils';

describe('Component: customization/FeedbackLink', () => {
  const defaultProps = {
    text: 'link text',
  };

  function getWrapper(extraProps) {
    return shallow(<FeedbackLink {...defaultProps} {...extraProps} />);
  }

  describe('When there is no customization in use', () => {
    let link;

    before(() => {
      link = getWrapper();
    });

    it('should render a link', () => {
      expect(link.type()).to.equal('a');
    });

    it('should render the text given in props', () => {
      expect(link.text()).to.equal(defaultProps.text);
    });

    it('should have correct href', () => {
      const expected = `${constants.FEEDBACK_URL}?ref=${window.location.href}`;
      expect(link.props().href).to.equal(expected);
    });
  });

  describe('When Espoo customization is used', () => {
    let link;

    before(() => {
      simple.mock(customizationUtils, 'getCurrentCustomization').returnWith('ESPOO');
      link = getWrapper();
    });

    after(() => {
      simple.restore();
    });

    it('should render a link', () => {
      expect(link.type()).to.equal('a');
    });

    it('should render the text given in props', () => {
      expect(link.text()).to.equal(defaultProps.text);
    });

    it('should have correct href', () => {
      const expected = `${constants.FEEDBACK_URL}?ref=${window.location.href}`;
      expect(link.props().href).to.equal(expected);
    });
  });
});
