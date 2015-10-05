import { expect } from 'chai';
import React from 'react';
import sd from 'skin-deep';

import ResourceDetails from 'components/resource/ResourceDetails';

describe('Component: ResourceDetails', () => {
  const props = {
    capacityString: 'for 10 people maximum.',
    description: 'Some description.',
    type: 'Studio',
  };
  let tree;

  before(() => {
    tree = sd.shallowRender(<ResourceDetails {...props} />);
  });

  it('should display the given type', () => {
    expect(tree.text()).to.contain(props.type);
  });

  it('should display the given capacityString', () => {
    expect(tree.text()).to.contain(props.capacityString);
  });

  it('should display the given description', () => {
    expect(tree.text()).to.contain(props.description);
  });
});
