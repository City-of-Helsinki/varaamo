import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import Loader from 'react-loader';

import ResourceList from 'screens/shared/resource-list';
import { scrollTo } from 'utils/DOMUtils';

class SearchResults extends Component {
  componentDidMount() {
    scrollTo(findDOMNode(this));
  }

  render() {
    const { date, isFetching, results, units } = this.props;

    return (
      <div id="search-results">
        <Loader loaded={!isFetching}>
          <ResourceList
            date={date}
            emptyMessage="Yhtään hakutulosta ei löytynyt."
            resources={results}
            units={units}
          />
        </Loader>
      </div>
    );
  }
}

SearchResults.propTypes = {
  date: PropTypes.string.isRequired,
  isFetching: PropTypes.bool.isRequired,
  results: PropTypes.array.isRequired,
  units: PropTypes.object.isRequired,
};

export default SearchResults;
