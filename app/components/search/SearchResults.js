import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import { Table } from 'react-bootstrap';
import Loader from 'react-loader';

import SearchResult from 'components/search/SearchResult';

class SearchResults extends Component {
  constructor(props) {
    super(props);
    this.renderSearchResult = this.renderSearchResult.bind(this);
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
      <Loader loaded={!isFetching}>
        {results.length ? (
          <Table striped>
            <thead>
              <tr>
                <th>Tila</th>
                <th>Vapaata</th>
              </tr>
            </thead>
            <tbody>
              {_.map(results, this.renderSearchResult)}
            </tbody>
          </Table>
        ) : (
          <p>Yhtään hakutulosta ei löytynyt.</p>
        )}
      </Loader>
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
