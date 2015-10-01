import { expect } from 'chai';
import React from 'react';
import TestUtils from 'react/lib/ReactTestUtils';
import simple from 'simple-mock';

import Immutable from 'seamless-immutable';

import SearchResults from 'components/search-page/SearchResults';
import { UnconnectedSearchPage as SearchPage } from 'containers/SearchPage';

describe('Container: SearchPage', () => {
  const props = {
    actions: { fetchResources: simple.stub() },
    category: 'Some category',
    results: Immutable([]),
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
  });

  describe('fetching data', () => {
    it('should fetch resources when component mounts', () => {
      expect(props.actions.fetchResources.callCount).to.equal(1);
    });
  });
});
