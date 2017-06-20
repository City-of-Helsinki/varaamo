import { expect } from 'chai';
import React from 'react';
import Loader from 'react-loader';
import Immutable from 'seamless-immutable';

import ResourceCompactList from 'shared/resource-compact-list';
import ResourceList from 'shared/resource-list';
import { shallowWithIntl } from 'utils/testUtils';
import SearchResults from './SearchResults';
import ResultsCount from './ResultsCount';

describe('pages/search/results/SearchResults', () => {
  const defaultProps = {
    isFetching: false,
    onToggleMap: () => {},
    searchResultIds: Immutable(['resource-1', 'resource-2']),
    showMap: false,
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

    it('renders a button to toggle the map', () => {
      const button = getWrapper().find('button.map-toggle');
      expect(button.props().onClick).to.deep.equal(defaultProps.onToggleMap);
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

    it('renders a show map text in map toggle button', () => {
      const toggleButton = getWrapper().find('.map-toggle');
      expect(toggleButton).to.have.length(1);
      expect(toggleButton.text()).to.contain('SearchResults.showMap');
    });

    describe('with showMap', () => {
      it('does not render ResourceList', () => {
        const resourceList = getWrapper({ showMap: true }).find(ResourceList);
        expect(resourceList).to.have.length(0);
      });

      it('renders a show list text in map toggle button', () => {
        const toggleButton = getWrapper({ showMap: true }).find('.map-toggle');
        expect(toggleButton).to.have.length(1);
        expect(toggleButton.text()).to.contain('SearchResults.showList');
      });

      describe('with selectedUnitId', () => {
        it('renders a ResourceCompactList', () => {
          const resourceCompactList = getWrapper({ showMap: true, selectedUnitId: '1' }).find(
            ResourceCompactList
          );
          expect(resourceCompactList).to.have.length(1);
          expect(resourceCompactList.prop('resourceIds')).to.deep.equal(
            defaultProps.searchResultIds
          );
          expect(resourceCompactList.prop('unitId')).to.deep.equal('1');
        });
      });
    });
  });
});
