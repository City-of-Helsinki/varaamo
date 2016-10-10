import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import Loader from 'react-loader';

import ResourceList from 'shared/resource-list';
import { scrollTo } from 'utils/domUtils';
import ResultsCount from './ResultsCount';

class SearchResults extends Component {
  componentDidMount() {
    scrollTo(findDOMNode(this));
  }

  render() {
    const { isFetching, searchResultIds } = this.props;

    return (
      <div id="search-results">
        <Loader loaded={!isFetching}>
          <ResultsCount
            emptyMessage="Yhtään hakutulosta ei löytynyt."
            resultIds={searchResultIds}
          />
          <ResourceList
            resourceIds={searchResultIds}
          />
        </Loader>
      </div>
    );
  }
}

SearchResults.propTypes = {
  isFetching: PropTypes.bool.isRequired,
  searchResultIds: PropTypes.array.isRequired,
};

export default SearchResults;
