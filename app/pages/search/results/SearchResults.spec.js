import { expect } from 'chai';
import React from 'react';
import Loader from 'react-loader';
import Immutable from 'seamless-immutable';

import ResourceList from 'shared/resource-list';
import { shallowWithIntl } from 'utils/testUtils';
import SearchResults from './SearchResults';
import ResultsCount from './ResultsCount';

describe('pages/search/results/SearchResults', () => {
  const defaultProps = {
    isFetching: false,
    searchResultIds: Immutable(['resource-1', 'resource-2']),
  };

  function getWrapper(extraProps) {
    return shallowWithIntl(<SearchResults {...defaultProps} {...extraProps} />);
  }

  describe('rendering', () => {
    describe('Loader', () => {
      it('is rendered', () => {
        const loader = getWrapper().find(Loader);
        expect(loader).to.have.length(1);
      });

      it('is loaded if isFetching is false', () => {
        const loader = getWrapper({ isFetching: false }).find(Loader);
        expect(loader.props().loaded).to.be.true;
      });

      it('is not loaded if isFetching is true', () => {
        const loader = getWrapper({ isFetching: true }).find(Loader);
        expect(loader.props().loaded).to.be.false;
      });
    });

    it('renders ResourceList with correct props', () => {
      const resourceList = getWrapper().find(ResourceList);
      expect(resourceList).to.have.length(1);
      expect(resourceList.props().resourceIds).to.deep.equal(defaultProps.searchResultIds);
    });

    it('renders a ResultsCount component with correct props', () => {
      const resultsCount = getWrapper().find(ResultsCount);
      expect(resultsCount).to.have.length(1);
      expect(resultsCount.props()).to.deep.equal({
        resultIds: defaultProps.searchResultIds,
        emptyMessage: 'SearchResults.emptyMessage',
      });
    });
  });
});
