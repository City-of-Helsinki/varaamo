import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';

import { getSearchPageUrl } from 'utils/searchUtils';
import NotFoundPage from './NotFoundPage';

describe('pages/not-found/NotFoundPage', () => {
  function getWrapper() {
    return shallow(<NotFoundPage />);
  }

  it('renders correct title inside h1 tags', () => {
    const h1 = getWrapper().find('h1');

    expect(h1.props().children).to.equal('404 Sivua ei löydy');
  });

  it('renders a list and list elements for displaying help to user', () => {
    const ul = getWrapper().find('ul');
    const lis = getWrapper().find('li');

    expect(ul.length).to.equal(1);
    expect(lis.length).to.equal(3);
  });

  it('renders a Link to search page', () => {
    const link = getWrapper().find('Link');

    expect(link.props().to).to.equal(getSearchPageUrl());
  });
});
