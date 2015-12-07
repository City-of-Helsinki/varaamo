import { expect } from 'chai';
import React from 'react';
import sd from 'skin-deep';

import NotFoundPage from 'containers/NotFoundPage';
import { getSearchPageUrl } from 'utils/SearchUtils';

describe('Container: NotFoundPage', () => {
  const props = {};
  const tree = sd.shallowRender(<NotFoundPage {...props} />);

  it('should display a proper title inside h1 tags', () => {
    const h1Tree = tree.subTree('h1');

    expect(h1Tree.props.children).to.equal('404 Sivua ei löydy');
  });

  it('should render a list and list elements for displaying help to user', () => {
    const ulTrees = tree.everySubTree('ul');
    const liTrees = tree.everySubTree('li');

    expect(ulTrees.length).to.equal(1);
    expect(liTrees.length).to.equal(3);
  });

  it('should render a Link to search page', () => {
    const linkTree = tree.subTree('Link');

    expect(linkTree.props.to).to.equal(getSearchPageUrl());
  });
});
