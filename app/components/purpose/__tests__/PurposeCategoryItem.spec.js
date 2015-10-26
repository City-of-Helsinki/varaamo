import { expect } from 'chai';
import React from 'react';
import sd from 'skin-deep';
import simple from 'simple-mock';

import _ from 'lodash';

import PurposeCategoryItem from 'components/purpose/PurposeCategoryItem';
import Purpose from 'fixtures/Purpose';

describe('Component: purpose/PurposeCategoryItem', () => {
  const props = {
    onItemClick: simple.stub(),
    purpose: Purpose.build(),
  };
  const tree = sd.shallowRender(<PurposeCategoryItem {...props} />);

  it('should render a ListGroupItem', () => {
    const listGroupItemTrees = tree.everySubTree('ListGroupItem');

    expect(listGroupItemTrees.length).to.equal(1);
  });

  describe('Link', () => {
    const linkTrees = tree.everySubTree('a');

    it('should be rendered', () => {
      expect(linkTrees.length).to.equal(1);
    });

    it('clicking the link should call onItemClick ', () => {
      const mockEvent = { preventDefault: simple.stub() };
      linkTrees[0].props.onClick(mockEvent);

      expect(props.onItemClick.callCount).to.equal(1);
    });

    it('should contain name of the purpose capitalized', () => {
      const expected = _.capitalize(props.purpose.name.fi);

      expect(tree.textIn('a')).to.contain(expected);
    });
  });
});
