import { expect } from 'chai';
import React from 'react';
import DocumentTitle from 'react-document-title';

import { shallowWithIntl } from 'utils/testUtils';
import HomePage from './HomePage';
import HomeIntro from './intro';
import Partners from './partners';
import PurposeListContainer from './purpose-list';

describe('pages/about/HomePage', () => {
  function getWrapper() {
    return shallowWithIntl(<HomePage />);
  }

  it('renders DocumentTitle component with correct title', () => {
    const title = getWrapper().find(DocumentTitle);
    expect(title.prop('title')).to.equal('Varaamo');
  });

  it('renders HomeIntro component', () => {
    expect(getWrapper().find(HomeIntro).length).to.equal(1);
  });

  it('renders header for purpose list', () => {
    const header = getWrapper().find('h3');
    expect(header.length).to.equal(1);
    expect(header.text()).to.equal('Home.purposeHeader');
  });

  it('renders PurposeListContainer component', () => {
    expect(getWrapper().find(PurposeListContainer).length).to.equal(1);
  });

  it('renders Partners component', () => {
    expect(getWrapper().find(Partners).length).to.equal(1);
  });
});
