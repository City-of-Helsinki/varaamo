import { expect } from 'chai';
import React from 'react';
import sd from 'skin-deep';

import ResourceHeader from 'components/resource/ResourceHeader';

describe('Component: resource/ResourceHeader', () => {
  const props = {
    address: 'Some address',
    name: 'Some name',
  };
  let tree;

  before(() => {
    tree = sd.shallowRender(<ResourceHeader {...props} />);
  });

  it('should display the given name inside "h1" element', () => {
    expect(tree.textIn('h1')).to.equal(props.name);
  });

  it('should display the given address inside "address" element', () => {
    expect(tree.textIn('address')).to.equal(props.address);
  });
});
