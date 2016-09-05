import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import simple from 'simple-mock';

import Favicon from 'components/customization/Favicon';
import * as customizationUtils from 'utils/CustomizationUtils';

import espooFavicon from 'assets/images/espoo-favicon.ico';
import helsinkiFavicon from 'assets/images/helsinki-favicon.ico';

describe('Component: customization/Favicon', () => {
  function getWrapper() {
    return shallow(<Favicon />);
  }

  describe('When there is no customization in use', () => {
    let favicon;

    before(() => {
      favicon = getWrapper();
    });

    it('should render favicon of Helsinki', () => {
      expect(favicon.props().url).to.deep.equal([helsinkiFavicon]);
    });
  });

  describe('When Espoo customization is used', () => {
    let favicon;

    before(() => {
      simple.mock(customizationUtils, 'getCurrentCustomization').returnWith('ESPOO');
      favicon = getWrapper();
    });

    after(() => {
      simple.restore();
    });

    it('should render favicon of Espoo', () => {
      expect(favicon.props().url).to.deep.equal([espooFavicon]);
    });
  });
});
