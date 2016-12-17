import { expect } from 'chai';
import React from 'react';

import PageWrapper from 'pages/PageWrapper';
import { shallowWithIntl } from 'utils/testUtils';
import AboutPage from './AboutPage';
import AboutPageContent from './AboutPageContent';

describe('pages/about/AboutPage', () => {
  function getWrapper() {
    return shallowWithIntl(<AboutPage />);
  }

  it('renders PageWrapper with correct props', () => {
    const pageWrapper = getWrapper().find(PageWrapper);
    expect(pageWrapper).to.have.length(1);
    expect(pageWrapper.prop('className')).to.equal('about-page');
    expect(pageWrapper.prop('title')).to.equal('AboutPage.title');
  });

  it('renders AboutPageContent component', () => {
    expect(getWrapper().find(AboutPageContent).length).to.equal(1);
  });
});
