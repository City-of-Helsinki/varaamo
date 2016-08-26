import { expect } from 'chai';
import React from 'react';
import sd from 'skin-deep';

import capitalize from 'lodash/capitalize';

import PurposeCategoryItem from 'components/purpose/PurposeCategoryItem';
import Purpose from 'fixtures/Purpose';
import { getSearchPageUrl } from 'utils/SearchUtils';

describe('Component: purpose/PurposeCategoryItem', () => {
  const props = {
    purpose: Purpose.build(),
  };
  const tree = sd.shallowRender(<PurposeCategoryItem {...props} />);

  it('should render a ListGroupItem', () => {
    const listGroupItemTrees = tree.everySubTree('ListGroupItem');

    expect(listGroupItemTrees.length).to.equal(1);
  });

  it('should render a Link', () => {
    expect(tree.subTree('Link')).to.be.ok;
  });

  it('should pass correct props to Link ', () => {
    const linkTree = tree.subTree('Link');

    expect(linkTree.props.to).to.equal(getSearchPageUrl({ purpose: props.purpose.id }));
  });

  it('should display name of the purpose capitalized', () => {
    const expected = capitalize(props.purpose.name.fi);

    expect(tree.subTree('Link').props.children).to.equal(expected);
  });
});
