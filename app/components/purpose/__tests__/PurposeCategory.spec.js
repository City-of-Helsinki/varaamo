import { expect } from 'chai';
import React from 'react';
import sd from 'skin-deep';
import simple from 'simple-mock';

import Immutable from 'seamless-immutable';

import PurposeCategory from 'components/purpose/PurposeCategory';
import Purpose from 'fixtures/Purpose';

describe('Component: PurposeCategory', () => {
  const props = {
    onItemClick: simple.stub(),
    purposes: Immutable([
      Purpose.build(),
      Purpose.build(),
    ]),
    mainType: 'some type',
  };
  let tree;

  before(() => {
    tree = sd.shallowRender(<PurposeCategory {...props} />);
  });

  describe('basic rendering', () => {
    it('should render a Panel component', () => {
      const panelTrees = tree.everySubTree('Panel');

      expect(panelTrees.length).to.equal(1);
    });

    it('should display the mainType in Panel header', () => {
      const panelVdom = tree.subTree('Panel').getRenderOutput();

      expect(panelVdom.props.header).to.equal(props.mainType);
    });

    it('should render a ListGroup component to hold individual purposes', () => {
      const listGroupTrees = tree.everySubTree('ListGroup');

      expect(listGroupTrees.length).to.equal(1);
    });
  });

  describe('rendering individual purposes', () => {
    let purposeTrees;

    before(() => {
      purposeTrees = tree.everySubTree('PurposeCategoryItem');
    });

    it('should render a PurposeCategoryItem for every purpose in props', () => {
      expect(purposeTrees.length).to.equal(props.purposes.length);
    });

    it('should pass correct props to PurposeCategoryItem', () => {
      purposeTrees.forEach((purposeTree, index) => {
        const purposeVdom = purposeTree.getRenderOutput();
        const actualProps = purposeVdom.props;

        expect(actualProps.purpose).to.deep.equal(props.purposes[index]);
        expect(actualProps.onItemClick).to.deep.equal(props.onItemClick);
      });
    });
  });
});
