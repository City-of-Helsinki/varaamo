import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import simple from 'simple-mock';

import FooterContent from 'components/customization/FooterContent';
import { FEEDBACK_URL } from 'constants/AppConstants';
import customizationUtils from 'utils/CustomizationUtils';

describe('Component: customization/FooterContent', () => {
  function getWrapper() {
    return shallow(<FooterContent />);
  }

  describe('When there is no customization in use', () => {
    let content;

    before(() => {
      content = getWrapper();
    });

    it('should contain Helsinki feedback link', () => {
      const feedbackLink = content.find('a');
      expect(feedbackLink.props().href).to.equal(FEEDBACK_URL);
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

    it('should contain text for Espoo', () => {
      const expected = 'Placeholder text for Espoo footer.';
      expect(content.find('p').text()).to.equal(expected);
    });
  });
});
