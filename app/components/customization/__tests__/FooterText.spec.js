import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import simple from 'simple-mock';

import FooterText from 'components/customization/FooterText';
import { FEEDBACK_URL } from 'constants/AppConstants';
import customizationUtils from 'utils/CustomizationUtils';

describe('Component: customization/FooterText', () => {
  function getWrapper() {
    return shallow(<FooterText />);
  }

  describe('When there is no customization in use', () => {
    let footerText;

    before(() => {
      footerText = getWrapper();
    });

    it('should render text paragraph', () => {
      expect(footerText.type()).to.equal('p');
    });

    it('should contain Helsinki feedback link', () => {
      const feedbackLink = footerText.find('a');
      expect(feedbackLink.props().href).to.equal(FEEDBACK_URL);
    });
  });

  describe('When Espoo customization is used', () => {
    let footerText;

    before(() => {
      simple.mock(customizationUtils, 'getCurrentCustomization').returnWith('ESPOO');
      footerText = getWrapper();
    });

    after(() => {
      simple.restore();
    });

    it('should render text paragraph', () => {
      expect(footerText.type()).to.equal('p');
    });

    it('should render text for Espoo', () => {
      const expected = 'Placeholder text for Espoo footer.';
      expect(footerText.text()).to.equal(expected);
    });
  });
});
