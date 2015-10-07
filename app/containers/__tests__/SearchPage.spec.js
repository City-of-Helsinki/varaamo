import { expect } from 'chai';
import React from 'react';
import TestUtils from 'react/lib/ReactTestUtils';
import simple from 'simple-mock';

import Immutable from 'seamless-immutable';

import SearchResults from 'components/search/SearchResults';
import { UnconnectedSearchPage as SearchPage } from 'containers/SearchPage';
import Resource from 'fixtures/Resource';
import Unit from 'fixtures/Unit';

describe('Container: SearchPage', () => {
  const unit = Unit.build();
  const resource = Resource.build();
  const props = {
    actions: {
      fetchResources: simple.stub(),
      fetchUnits: simple.stub(),
    },
    isFetchingSearchResults: false,
    results: Immutable([resource]),
    units: Immutable({ [unit.id]: unit }),
  };
  let page;

  before(() => {
    page = TestUtils.renderIntoDocument(<SearchPage {...props} />);
  });

  describe('rendering', () => {
    it('should render without problems', () => {
      expect(page).to.be.ok;
    });

    it('should set a correct page title', () => {
      expect(document.title).to.equal('Haku - Respa');
    });

    it('should render SearchResults component', () => {
      const searchResults = TestUtils.findRenderedComponentWithType(page, SearchResults);

      expect(searchResults).to.exist;
    });

    it('should pass correct props to SearchResults component', () => {
      const searchResults = TestUtils.findRenderedComponentWithType(page, SearchResults);

      expect(searchResults.props.isFetching).to.equal(props.isFetchingSearchResults);
      expect(searchResults.props.results).to.deep.equal(props.results);
      expect(searchResults.props.units).to.deep.equal(props.units);
    });
  });

  describe('fetching data', () => {
    it('should fetch resources when component mounts', () => {
      expect(props.actions.fetchResources.callCount).to.equal(1);
    });

    it('should fetch units when component mounts', () => {
      expect(props.actions.fetchUnits.callCount).to.equal(1);
    });
  });
});
