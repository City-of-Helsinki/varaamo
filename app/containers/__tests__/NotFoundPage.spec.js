import { expect } from 'chai';
import React from 'react';
import sd from 'skin-deep';

import NotFoundPage from 'containers/NotFoundPage';

describe('Container: NotFoundPage', () => {
  const props = {};
  const tree = sd.shallowRender(<NotFoundPage {...props} />);

  it('should display a proper title inside h1 tags', () => {
    const h1Vdom = tree.subTree('h1').getRenderOutput();

    expect(h1Vdom.props.children).to.equal('404 Sivua ei löydy');
  });

  it('should render a list and list elements for displaying help to user', () => {
    const ulTrees = tree.everySubTree('ul');
    const liTrees = tree.everySubTree('li');

    expect(ulTrees.length).to.equal(1);
    expect(liTrees.length).to.equal(3);
  });

  it('should render a Link to search page', () => {
    const linkVdom = tree.subTree('Link').getRenderOutput();

    expect(linkVdom.props.to).to.equal('/search');
  });
});
