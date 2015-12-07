import map from 'lodash/collection/map';
import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { Table } from 'react-bootstrap';
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
            <Table className="search-results lined">
              <thead>
                <tr>
                  <th colSpan="2">Tila</th>
                  <th>Vapaata</th>
                </tr>
              </thead>
              <tbody>
                {map(results, this.renderSearchResult)}
              </tbody>
            </Table>
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
