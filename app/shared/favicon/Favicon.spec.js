import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import simple from 'simple-mock';

import * as customizationUtils from 'utils/customizationUtils';
import Favicon from './Favicon';
import espooFavicon from './espoo-favicon.ico';
import helsinkiFavicon from './helsinki-favicon.ico';

describe('shared/favicon/Favicon', () => {
  function getWrapper() {
    return shallow(<Favicon />);
  }

  describe('When there is no customization in use', () => {
    let favicon;

    before(() => {
      favicon = getWrapper();
    });

    it('renders favicon of Helsinki', () => {
      expect(favicon.prop('link')[0].href).to.deep.equal(helsinkiFavicon);
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

    it('renders favicon of Espoo', () => {
      expect(favicon.prop('link')[0].href).to.deep.equal(espooFavicon);
    });
  });
});
