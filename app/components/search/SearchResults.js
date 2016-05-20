import map from 'lodash/collection/map';
import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import Loader from 'react-loader';

import SearchResult from 'components/search/SearchResult';
import { scrollTo } from 'utils/DOMUtils';

class SearchResults extends Component {
  constructor(props) {
    super(props);
    this.renderSearchResult = this.renderSearchResult.bind(this);
  }

  componentDidMount() {
    scrollTo(findDOMNode(this));
  }

  renderSearchResult(result) {
    const unit = this.props.units[result.unit] || {};

    return (
      <SearchResult
        date={this.props.date}
        key={result.id}
        result={result}
        unit={unit}
      />
    );
  }

  render() {
    const { isFetching, results } = this.props;

    return (
      <div id="search-results">
        <Loader loaded={!isFetching}>
          {results.length ? (
            <ul className="search-results">
              {map(results, this.renderSearchResult)}
            </ul>
          ) : (
            <p>Yhtään hakutulosta ei löytynyt.</p>
          )}
        </Loader>
      </div>
    );
  }
}

SearchResults.propTypes = {
  date: PropTypes.string.isRequired,
  filters: PropTypes.object.isRequired,
  isFetching: PropTypes.bool.isRequired,
  results: PropTypes.array.isRequired,
  units: PropTypes.object.isRequired,
};

export default SearchResults;
