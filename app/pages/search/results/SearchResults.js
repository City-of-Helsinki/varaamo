import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import Loader from 'react-loader';

import ResourceList from 'shared/resource-list';
import { injectT } from 'i18n';
import { scrollTo } from 'utils/domUtils';
import ResultsCount from './ResultsCount';

class SearchResults extends Component {
  componentDidMount() {
    scrollTo(findDOMNode(this));
  }

  render() {
    const {
      isFetching,
      onToggleMap,
      searchResultIds,
      showMap,
      t,
    } = this.props;

    return (
      <div id="search-results">
        <Loader loaded={!isFetching}>
          <button
            className="map-toggle btn-primary btn"
            onClick={onToggleMap}
          >
            <ResultsCount
              emptyMessage={t('SearchResults.emptyMessage')}
              resultIds={searchResultIds}
            />
            {showMap ? t('SearchResults.showList') : t('SearchResults.showMap')}
          </button>
          {!showMap &&
            <ResourceList
              resourceIds={searchResultIds}
            />
          }
        </Loader>
      </div>
    );
  }
}

SearchResults.propTypes = {
  isFetching: PropTypes.bool.isRequired,
  onToggleMap: PropTypes.func.isRequired,
  searchResultIds: PropTypes.array.isRequired,
  showMap: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired,
};

export default injectT(SearchResults);
