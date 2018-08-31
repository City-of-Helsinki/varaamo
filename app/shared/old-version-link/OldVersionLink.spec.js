import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import simple from 'simple-mock';

import constants from 'constants/AppConstants';
import * as customizationUtils from 'utils/customizationUtils';
import OldVersionLink from './OldVersionLink';

describe('shared/old-version-link/OldVersionLink', () => {
  const linkChildren = <span>Some text</span>;

  function getWrapper() {
    return shallow(<OldVersionLink>{linkChildren}</OldVersionLink>);
  }

  describe('Old version link in footer', () => {
    let link;

    before(() => {
      link = getWrapper();
    });

    it('contains old-version-link link', () => {
      const oldversionLink = content.find(OldVersionLink);
      expect(oldversionLink.length).to.equal(1);
    });

    it('renders a link', () => {
      expect(link.type()).to.equal('a');
    });

    it('has correct href', () => {
      const expected = `${constants.OLD_VERSION_URL}&ref=${window.location.href}`;
      expect(link.props().href).to.equal(expected);
    });
  });
});
