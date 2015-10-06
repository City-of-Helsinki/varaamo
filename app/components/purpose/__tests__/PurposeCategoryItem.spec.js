import { expect } from 'chai';
import React from 'react';
import sd from 'skin-deep';

import _ from 'lodash';

import PurposeCategoryItem from 'components/purpose/PurposeCategoryItem';
import Purpose from 'fixtures/Purpose';

describe('Component: PurposeCategoryItem', () => {
  const props = {
    purpose: Purpose.build(),
  };
  const tree = sd.shallowRender(<PurposeCategoryItem {...props} />);

  it('should render a ListGroupItem', () => {
    const listGroupItemTrees = tree.everySubTree('ListGroupItem');

    expect(listGroupItemTrees.length).to.equal(1);
  });

  it('should display name of the purpose capitalized', () => {
    const expected = _.capitalize(props.purpose.name.fi);

    expect(tree.toString()).to.contain(expected);
  });
});
