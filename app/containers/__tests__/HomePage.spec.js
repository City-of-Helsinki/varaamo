import { expect } from 'chai';
import React from 'react';
import TestUtils from 'react/lib/ReactTestUtils';
import simple from 'simple-mock';

import Immutable from 'seamless-immutable';

import PurposeCategoryList from 'components/purpose/PurposeCategoryList';
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
  let page;

  before(() => {
    page = TestUtils.renderIntoDocument(<HomePage {...props} />);
  });

  describe('rendering', () => {
    it('should render without problems', () => {
      expect(page).to.be.ok;
    });

    it('should set a correct page title', () => {
      expect(document.title).to.equal('Etusivu - Respa');
    });

    it('should render PurposeCategoryList component', () => {
      const purposeCategoryList = TestUtils.findRenderedComponentWithType(
        page, PurposeCategoryList
      );

      expect(purposeCategoryList).to.exist;
    });

    it('should pass correct props to PurposeCategoryList component', () => {
      const purposeCategoryList = TestUtils.findRenderedComponentWithType(
        page, PurposeCategoryList
      );

      expect(purposeCategoryList.props.purposeCategories).to.equal(props.purposeCategories);
    });
  });

  describe('fetching data', () => {
    it('should fetch purposes when component mounts', () => {
      expect(props.actions.fetchPurposes.callCount).to.equal(1);
    });
  });
});
