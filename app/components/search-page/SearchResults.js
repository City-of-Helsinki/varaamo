import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import { Table } from 'react-bootstrap';
import Loader from 'react-loader';

import SearchResult from 'components/search-page/SearchResult';

export class SearchResults extends Component {
  renderSearchResult(result) {
    return <SearchResult key={result.id} result={result} />;
  }

  render() {
    const { isFetching, results } = this.props;

    return (
      <Loader loaded={!isFetching}>
        <Table striped>
          <thead>
            <tr>
              <th>Nimi</th>
              <th>Yksikkö</th>
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
};

export default SearchResults;
