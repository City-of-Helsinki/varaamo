import { expect } from 'chai';
import React from 'react';

import PageWrapper from 'pages/PageWrapper';
import { shallowWithIntl } from 'utils/testUtils';
import NotFoundPage from './NotFoundPage';

describe('pages/not-found/NotFoundPage', () => {
  function getWrapper() {
    return shallowWithIntl(<NotFoundPage />);
  }

  it('renders PageWrapper with correct title', () => {
    const pageWrapper = getWrapper().find(PageWrapper);
    expect(pageWrapper).to.have.length(1);
    expect(pageWrapper.prop('title')).to.equal('NotFoundPage.title');
  });

  it('renders correct title inside h1 tags', () => {
    const h1 = getWrapper().find('h1');
    expect(h1.props().children).to.equal('NotFoundPage.title');
  });

  it('renders a list and list elements for displaying help to user', () => {
    const ul = getWrapper().find('ul');
    const lis = getWrapper().find('li');
    expect(ul.length).to.equal(1);
    expect(lis.length).to.equal(3);
  });
});
