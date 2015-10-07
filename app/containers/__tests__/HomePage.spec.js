import { expect } from 'chai';
import React from 'react';
import sd from 'skin-deep';
import simple from 'simple-mock';

import Immutable from 'seamless-immutable';

import { UnconnectedHomePage as HomePage } from 'containers/HomePage';
import Purpose from 'fixtures/Purpose';

describe('Container: HomePage', () => {
  const props = {
    actions: {
      fetchPurposes: simple.stub(),
    },
    purposeCategories: Immutable({
      someType: [Purpose.build()],
    }),
  };
  const tree = sd.shallowRender(<HomePage {...props} />);

  describe('rendering PurposeCategoryList', () => {
    const purposeCategoryListTrees = tree.everySubTree('PurposeCategoryList');

    it('should render PurposeCategoryList component', () => {
      expect(purposeCategoryListTrees.length).to.equal(1);
    });

    it('should pass correct props to PurposeCategoryList component', () => {
      const purposeCategoryListVdom = purposeCategoryListTrees[0].getRenderOutput();
      const actualProps = purposeCategoryListVdom.props;

      expect(actualProps.purposeCategories).to.equal(props.purposeCategories);
    });
  });

  describe('fetching data', () => {
    before(() => {
      const instance = tree.getMountedInstance();
      instance.componentDidMount();
    });

    it('should fetch purposes when component mounts', () => {
      expect(props.actions.fetchPurposes.callCount).to.equal(1);
    });
  });
});
