import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import { Table } from 'react-bootstrap';
import Loader from 'react-loader';

import SearchResult from 'components/search/SearchResult';

export class SearchResults extends Component {
  constructor(props) {
    super(props);
    this.renderSearchResult = this.renderSearchResult.bind(this);
  }

  renderSearchResult(result) {
    const unit = this.props.units[result.unit] || {};

    return (
      <SearchResult
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
        <Table striped>
          <thead>
            <tr>
              <th>Tila</th>
              <th>Sijainti</th>
            </tr>
          </thead>
          <tbody>
            {_.map(results, this.renderSearchResult)}
          </tbody>
        </Table>
      </Loader>
    );
  }
}

SearchResults.propTypes = {
  isFetching: PropTypes.bool,
  results: PropTypes.array.isRequired,
  units: PropTypes.object.isRequired,
};

export default SearchResults;
